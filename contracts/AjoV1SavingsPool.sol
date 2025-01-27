//SPDX-License-Identifier: NONE
pragma solidity ^ 0.8.19;

import {IERC20} from "./IERC20.sol";
import {ReentrancyGuard} from "./ReentrancyGuard.sol";
import {AjoV1Library} from "libraries/AjoV1Library.sol";

contract AjoV1SavingsPool is ReentrancyGuard {
    event Contribution(address indexed from, uint256 value);
    event Sync(uint256 balance);
    event Payout(address indexed to, uint256 value);

    address public contributionToken;
    address public administrator;
    address public factory;
    address[] public uniqueAddresses;
    address public creator;

    uint256 public interval;
    uint256 public contribution;
    uint256 startTime;
    mapping(address => mapping(IERC20 => uint256)) public tokenBalancesByUser;
    mapping(address => mapping(IERC20 => Deposit[])) public tokenDepositsByUser;
    mapping(address => bool) public isUniqueAddress;
    uint256 public lastPayoutTimestamp;
    uint256 public lastProcessedInterval;

    struct Interval {
        uint256 totalDeposits;
        uint256 endTimestamp;
    }

    struct Deposit {
        uint256 amount;
        uint256 timestamp;
        uint256 intervalIndex;
    }

    Interval[] public intervals;

    uint256 public contractBalance;

    constructor(address _contributionToken, address _administrator, uint256 _interval, uint256 _contribution) {
        contributionToken = _contributionToken;
        factory = msg.sender;
        administrator = _administrator;
        interval = _interval;
        contribution = _contribution;
        startTime = block.timestamp;
        intervals.push(Interval({totalDeposits: 0, endTimestamp: block.timestamp + _interval}));
        creator = _administrator;
    }

    modifier onlyAdministrator() {
        require(msg.sender == administrator, "AjoV1SavingsPool: You are not the Administrator");
        _;
    }

    modifier onlyMembers() {
        require(isUniqueAddress[msg.sender], "AjoV1SavingsPool: You are not a member");
        _;
    }

    function payout(uint256 timestamp, address recipient) external nonReentrant onlyAdministrator {
        require(timestamp >= intervals[0].endTimestamp, "AjoV1SavingsPool: No full interval has passed");
        require(timestamp <= block.timestamp, "AjoV1SavingsPool: Timestamp cannot be in the future");
        uint256 targetIntervalIndex;
        // Find the target interval for the given timestamp
        for (uint256 i = 0; i < intervals.length; i++) {
            if (timestamp <= intervals[i].endTimestamp) {
                targetIntervalIndex = i > 0 ? i - 1 : 0;
                break;
            }
        }
        uint256 intervalsToProcess;
        // Calculate how many intervals to process
        if (lastProcessedInterval == 0 && lastPayoutTimestamp == 0) {
            intervalsToProcess = targetIntervalIndex + 1;
        } else {
            intervalsToProcess = targetIntervalIndex - lastProcessedInterval;
        }
        require(intervalsToProcess == 1, "AjoV1SavingsPool: Please only process one interval at a time");
        // Update state variables
        lastPayoutTimestamp = block.timestamp;
        lastProcessedInterval = targetIntervalIndex;
        //transfer fee
        uint256 feeAmount =
            AjoV1Library.transferFee(intervals[targetIntervalIndex].totalDeposits, contributionToken, factory);
        uint256 withdrawalAmount = intervals[targetIntervalIndex].totalDeposits - feeAmount;
        //transfer amount
        assert(IERC20(contributionToken).transfer(recipient, withdrawalAmount));
        emit Payout(recipient, withdrawalAmount);
        _update();
    }

    function rageQuit() external nonReentrant onlyAdministrator {
        //set last processed interval to last interval
        lastProcessedInterval = intervals.length - 1;
        //set last payout timestamp to block timestamp
        lastPayoutTimestamp = block.timestamp;
        //create a new interval so members can not contribute to a closed out interval
        intervals.push(Interval({totalDeposits: 0, endTimestamp: block.timestamp + interval}));

        //transfer out the contract balance to the administrator
        //no fee for rage quitting
        assert(IERC20(contributionToken).transfer(administrator, IERC20(contributionToken).balanceOf(address(this))));
        //update contract balance
        _update();
    }

    function contribute(uint256 amount) external nonReentrant onlyMembers {
        require(amount == contribution, "AjoV1SavingsPool: Incorrect contribution amount");
        require(IERC20(contributionToken).balanceOf(msg.sender) >= amount, "AjoV1SavingsPool: Insufficient Funds");
        // Transfer tokens from the caller to ourselves.
        assert(IERC20(contributionToken).transferFrom(msg.sender, address(this), amount));
        uint256 currentIntervalIndex = intervals.length - 1;
        //create a new interval if required
        if (block.timestamp >= intervals[currentIntervalIndex].endTimestamp) {
            intervals.push(Interval({totalDeposits: 0, endTimestamp: block.timestamp + interval}));
            currentIntervalIndex++;
        }

        //update deposits for the current interval
        intervals[currentIntervalIndex].totalDeposits += amount;
        //credit the caller and save their deposit amount with the block time stamp
        tokenDepositsByUser[msg.sender][IERC20(contributionToken)].push(
            Deposit({amount: amount, timestamp: block.timestamp, intervalIndex: currentIntervalIndex})
        );
        //update token balance, currently tracking separately from the deposits
        //need to think about this
        tokenBalancesByUser[msg.sender][IERC20(contributionToken)] += amount;
        _update();
        emit Contribution(msg.sender, amount);
    }

    function addMembers(address[] calldata _members) external nonReentrant onlyAdministrator {
        require(_members.length > 0, "AjoV1SavingsPool: No addresses provided");
        for (uint256 i = 0; i < _members.length; i++) {
            if (!isUniqueAddress[_members[i]]) {
                isUniqueAddress[_members[i]] = true;
                uniqueAddresses.push(_members[i]);
                tokenBalancesByUser[_members[i]][IERC20(contributionToken)] = 0;
            }
        }
    }

    function _update() internal {
        contractBalance = IERC20(contributionToken).balanceOf(address(this));
        emit Sync(contractBalance);
    }

    function getAllIntervals() external view returns (uint256) {
        return intervals.length;
    }

    function contributionTokenName() external view returns (string memory) {
        try IERC20(contributionToken).name() returns (string memory tokenName) {
            return tokenName;
        } catch {
            return "Unknown Token";
        }
    }
}
