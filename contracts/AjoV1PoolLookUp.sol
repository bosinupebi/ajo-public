//SPDX-License-Identifier: NONE
pragma solidity ^ 0.8.19;

import {AjoV1LotteryPool} from "./AjoV1LotteryPool.sol";
import {AjoV1SavingsPool} from "./AjoV1SavingsPool.sol";
import {AjoV1Factory} from "./AjoV1Factory.sol";
import {ERC20} from "./ERC20.sol";

contract AjoV1PoolLookUp {
    struct LotteryPoolData {
        uint256 balance;
        address creator;
        address contributionToken;
        string tokenName;
        address poolAddress;
        uint256 decimals;
        uint256 contribution;
    }

    struct SavingsPoolData {
        uint256 balance;
        address administrator;
        address contributionToken;
        string tokenName;
        uint256 interval;
        uint256 contribution;
        uint256 decimals;
        address poolAddress;
    }

    function getLotteryPoolData(address _factory) external view returns (LotteryPoolData[] memory) {
        AjoV1Factory ajoFactory = AjoV1Factory(_factory);

        uint256 length = ajoFactory.allLotteryPoolsLength();

        LotteryPoolData[] memory poolsData = new LotteryPoolData[](length);

        for (uint256 i = 0; i < length; i++) {
            AjoV1LotteryPool pool = AjoV1LotteryPool(ajoFactory.allLotteryPools(i));
            address contributionToken = pool.contributionToken();
            uint8 decimals;

            // Check if contributionToken is a valid contract
            if (contributionToken.code.length > 0) {
                try ERC20(contributionToken).decimals() returns (uint8 tokenDecimals) {
                    decimals = tokenDecimals;
                } catch {
                    decimals = 18;
                }
            } else {
                decimals = 0;
            }
            poolsData[i] = LotteryPoolData({
                balance: pool.contractBalance(),
                creator: pool.creator(),
                contribution: pool.contribution(),
                contributionToken: contributionToken,
                tokenName: pool.contributionTokenName(),
                decimals: decimals,
                poolAddress: address(pool)
            });
        }

        return poolsData;
    }

    function getSavingsPoolData(address _factory) external view returns (SavingsPoolData[] memory) {
        // Instantiate the factory contract
        AjoV1Factory ajoFactory = AjoV1Factory(_factory);

        uint256 length = ajoFactory.allSavingsPoolsLength();

        SavingsPoolData[] memory poolsData = new SavingsPoolData[](length);

        for (uint256 i = 0; i < length; i++) {
            AjoV1SavingsPool pool = AjoV1SavingsPool(ajoFactory.allSavingsPools(i));
            address contributionToken = pool.contributionToken();
            uint8 decimals;

            // Check if contributionToken is a valid contract
            if (contributionToken.code.length > 0) {
                try ERC20(contributionToken).decimals() returns (uint8 tokenDecimals) {
                    decimals = tokenDecimals;
                } catch {
                    decimals = 18; // Default to 18 decimals for safety
                }
            } else {
                decimals = 0; // Indicate invalid token
            }

            poolsData[i] = SavingsPoolData({
                balance: pool.contractBalance(),
                administrator: pool.administrator(),
                contributionToken: contributionToken,
                tokenName: pool.contributionTokenName(),
                interval: pool.interval(),
                contribution: pool.contribution(),
                decimals: decimals,
                poolAddress: address(pool)
            });
        }

        return poolsData;
    }
}
