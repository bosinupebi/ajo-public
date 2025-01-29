# AjoV1

The word 'ajo' is a Yoruba word that translates to “group or organisational savings”

This repository contains the solidity contracts that will enable groups of people pool resources and a random winner will be selected at intervals.

In desigining version 1 the ultimate goal was simplicity which is why a random order is chosen for the lottery pool.

The Savings Pool tries to emulate the traditional ajo but allowing the community completely to manage the custody of the funds without an intermediary.



# Contracts

**AjoV1Factory.sol** - Deploys two types of pool contracts. a lottery pool and a savings pool. <br><br>
**AjoV1SavingsPool.sol** - AjoV1 pool contract intended to mimic the traditional ajo structure, only in this case smart contracts custody the funds. <br><br>
**AjoV1LotteryPool.sol** - AjoV1 pool contract intended to mimic a lottery mechanism where users contribute any erc20 token, once the payout function is called a 'random' user receives the entire balance of the contract. we say random in quotes because the code will be available so the result can be predicted, however because it will be difficult to position an address at an index to win ahead of time, the mechanism is likely difficult to predict.<br><br>
**AjoV1PoolLookUp.sol** - AjoV1 lookup contract intended to quickly aggregate lottery and savings pool data. 



# Front-End

**ajo-frontend** - The front end is written in React(TypeScript) and uses Next.js as the frontend framework, wagmi.sh as the evm frontend library. 

**supported networks** - Ethereum Mainnet (ChainID:1), Ethereum Classic(ChainID:61)



# Utils

**pythonutils** - This folder contains the util.py file which contains simple helper functions for creating pools and viewing the status of core contracts


# Getting Started

**deploy contracts** - Deploy AjoV1Factory.sol and AjoV1PoolLookUp.sol

**update env file** - Then update the contract address in the .env file

**start the web application** - Navigate to the 'ajo-frontend' folder and run the command npm run dev





| Chain| Contract | Deploy Address |
|----------|----------|----------|
| Ethereum  | AjoV1Factory  | 0xF4f6Fd1b5F64e668a953E548EE15F2c79c8C6CAA  |
| Ethereum Classic  | AjoV1Factory   | 0xB5bD1AaB1AaBD2749257131716EdE5616cE11896 |

