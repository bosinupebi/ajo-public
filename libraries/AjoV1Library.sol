//SPDX-License-Identifier: NONE
pragma solidity ^ 0.8.19;

import {IERC20} from "../contracts/IERC20.sol";
import {ReentrancyGuard} from "../contracts/ReentrancyGuard.sol";
import {AjoV1Factory} from "../contracts/AjoV1Factory.sol";

library AjoV1Library {
    event FeePaid(address indexed feeTo, uint256 amount);

    function transferFee(uint256 _totalAmount, address _contributionToken, address _factory)
        internal
        returns (uint256)
    {
        uint256 feePercentage = AjoV1Factory(_factory).fee();
        address feeTo = AjoV1Factory(_factory).feeTo();
        uint256 feeAmount = (_totalAmount * feePercentage) / 100;
        if (feeAmount > 0) {
            assert(IERC20(_contributionToken).transfer(feeTo, feeAmount));
            emit FeePaid(feeTo, feeAmount);
        }
        return feeAmount;
    } 

    function removeAllOccurrences(address _address, address[] storage _list) internal {
        uint256 count = 0;
        uint256 i = 0;

        while (i < _list.length) {
            if (_list[i] == _address) {
                // Element found, remove it
                _list[i] = _list[_list.length - 1];
                _list.pop();
                count++;
                // Don't increment i here, as we need to check the swapped element
            } else {
                i++;
            }
        }
    }
}
