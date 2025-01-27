//SPDX-License-Identifier: NONE
pragma solidity ^ 0.8.19;

import {AjoV1LotteryPool} from "./AjoV1LotteryPool.sol";
import {AjoV1SavingsPool} from "./AjoV1SavingsPool.sol";

contract AjoV1Factory {
    address public feeTo;
    address public feeToSetter;
    uint256 public fee;

    address[] public allSavingsPools;
    address[] public allLotteryPools;

    event SavingsPoolCreated(address indexed poolAddress);
    event LotteryPoolCreated(address indexed poolAddress);

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function allSavingsPoolsLength() external view returns (uint256) {
        return allSavingsPools.length;
    }

    function allLotteryPoolsLength() external view returns (uint256) {
        return allLotteryPools.length;
    }

    function createSavingsPool(address contributionToken, uint256 interval, uint256 contribution)
        external
        returns (address pool)
    {
        require(contributionToken != address(0), "AjoV1Factory: ZERO_ADDRESS");
        bytes memory bytecode = type(AjoV1SavingsPool).creationCode;
        bytes memory initCode =
            abi.encodePacked(bytecode, abi.encode(contributionToken, msg.sender, interval, contribution));
        bytes32 salt = keccak256(abi.encodePacked(contributionToken, msg.sender, block.timestamp));
        assembly {
            pool := create2(0, add(initCode, 32), mload(initCode), salt)
        }
        require(pool != address(0), "AjoV1Factory: FAILED_DEPLOYMENT");
        allSavingsPools.push(pool);
        emit SavingsPoolCreated(pool);
    }

    function createLotteryPool(address contributionToken, uint256 contribution) external returns (address pool) {
        require(contributionToken != address(0), "AjoV1Factory: ZERO_ADDRESS");
        bytes memory bytecode = type(AjoV1LotteryPool).creationCode;
        bytes memory initCode = abi.encodePacked(bytecode, abi.encode(contributionToken, contribution, msg.sender));
        bytes32 salt = keccak256(abi.encodePacked(contributionToken, contribution, msg.sender, block.timestamp));
        assembly {
            pool := create2(0, add(initCode, 32), mload(initCode), salt)
        }
        require(pool != address(0), "AjoV1Factory: FAILED_DEPLOYMENT");
        allLotteryPools.push(pool);
        emit LotteryPoolCreated(pool);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "AjoV1Factory: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "AjoV1Factory: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    function setFee(uint256 _fee) external {
        require(msg.sender == feeToSetter, "AjoV1Factory: FORBIDDEN");
        fee = _fee;
    }
}
