//SPDX-License-Identifier: NONE
pragma solidity ^ 0.8.19;

import {IERC20} from "./IERC20.sol";
import {ReentrancyGuard} from "./ReentrancyGuard.sol";
import {AjoV1Library} from "libraries/AjoV1Library.sol";

contract AjoV1LotteryPool is ReentrancyGuard {
    event Join(address indexed from, uint256 value);
    event Sync(uint256 balance);
    event Payout(address indexed to, uint256 value);
    event FeePaid(address feeTo, uint256 amount);

    address public contributionToken;
    address public creator;
    address public factory;
    string private luckyPhrase;
    mapping(address => mapping(IERC20 => uint256)) public tokenBalancesByUser;
    uint256 public contribution;
    address[] public uniqueAddresses;
    mapping(address => bool) private isUniqueAddress;
    uint256 public contractBalance;

    constructor(address _contributionToken, uint256 _contribution, address _creator) {
        contributionToken = _contributionToken;
        factory = msg.sender;
        contribution = _contribution;
        creator = _creator;
    }

    function payout(string calldata _luckyPhrase) external nonReentrant {
        require(bytes(_luckyPhrase).length > 15, "AjoV1LotteryPool: Lucky phrase must be at least 15 characters long");
        require(contractBalance > 0);
        luckyPhrase = _luckyPhrase;
        clearUserTokenBalances();
        address winner = getRandomAddress();
        delete uniqueAddresses;
        delete luckyPhrase;
        uint256 feeAmount = AjoV1Library.transferFee(contractBalance, contributionToken, factory);
        uint256 winnerAmount = contractBalance - feeAmount;
        assert(IERC20(contributionToken).transfer(winner, winnerAmount));
        emit Payout(winner, winnerAmount);
        _update();
    }

    function join(uint256 amount) external nonReentrant {
        require(amount > 0, "AjoV1LotteryPool: Incorrect contribution amount");
        require(amount >= contribution, "AjoV1LotteryPool: Incorrect contribution amount");
        require(IERC20(contributionToken).balanceOf(msg.sender) >= amount, "AjoV1LotteryPool: Insufficient Funds");
        // Transfer tokens from the caller to ourselves.
        assert(IERC20(contributionToken).transferFrom(msg.sender, address(this), amount));
        tokenBalancesByUser[msg.sender][IERC20(contributionToken)] += amount;
        addUniqueAddress(msg.sender);
        _update();
        emit Join(msg.sender, amount);
    }

    function _update() internal {
        contractBalance = IERC20(contributionToken).balanceOf(address(this));
        emit Sync(contractBalance);
    }

    function rageQuit() external nonReentrant {
        uint256 availableBalance = tokenBalancesByUser[msg.sender][IERC20(contributionToken)];
        tokenBalancesByUser[msg.sender][IERC20(contributionToken)] -= availableBalance;
        AjoV1Library.removeAllOccurrences(msg.sender, uniqueAddresses);
        isUniqueAddress[msg.sender] = false;
        assert(IERC20(contributionToken).transfer(msg.sender, availableBalance));
        _update();
    }

    function getRandomAddress() internal view returns (address) {
        require(uniqueAddresses.length > 0, "AjoV1LotteryPool: No addresses in the list");
        // Generate a pseudo-random index based on block attributes
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, uint256(blockhash(block.number - 1)), msg.sender, luckyPhrase))
        ) % uniqueAddresses.length;
        // Return the address at the generated somewhat random index
        return uniqueAddresses[randomIndex];
    }

    function addUniqueAddress(address _address) internal {
        if (!isUniqueAddress[_address]) {
            isUniqueAddress[_address] = true;
            uniqueAddresses.push(_address);
        }
    }

    function clearUserTokenBalances() internal {
        for (uint256 i = 0; i < uniqueAddresses.length; i++) {
            address user = uniqueAddresses[i];
            tokenBalancesByUser[user][IERC20(contributionToken)] = 0; // Reset the balance
        }
    }

    function contributionTokenName() external view returns (string memory) {
        try IERC20(contributionToken).name() returns (string memory tokenName) {
            return tokenName;
        } catch {
            return "Unknown Token";
        }
    }
}
