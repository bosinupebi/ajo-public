import React, { useState, useEffect, useMemo } from "react";
import { LotteryPool, LotteryPoolsProps } from "@/constants";
import { convertDecimalsToAmount } from "@/util";
import { useWriteContract, useReadContracts, useAccount } from "wagmi";
import { lotteryPoolAbi, erc20Abi } from "@/abi";
import QuitPool from "./quitpool";
import PayoutLotteryPoolPopup from "./payoutlotterypool";
import ApproveAmountPopup from "./approveamount";
import JoinLotteryPoolPopup from "./joinlotterypool";

export default function LotteryPools({ pools }: LotteryPoolsProps) {
  const { writeContract, isPending, isError, isSuccess, error, data: hash } = useWriteContract();
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isPayoutPopupOpen, setIsPayoutPopupOpen] = useState(false);
  const [isApproveAmountPopUpOpen, setIsApproveAmountPopUp] = useState(false);
  const [isJoinLotteryPopUpOpen, setIsJoinLotteryPopUpOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [contributionAmount, setContributionAmount] = useState(0);
  const account = useAccount();
  const [allowances, setAllowances] = useState<{ [key: string]: number }>({});

  // Memoize the contract reads configuration to prevent recreation on every render
  const allowanceReads = useMemo(() => {
    if (!account.address) return [];
    
    return pools.map(pool => ({
      abi: erc20Abi,
      address: pool.contributionToken as `0x${string}`,
      functionName: "allowance",
      args: [account.address as `0x${string}`, pool.poolAddress as `0x${string}`],
      enabled: true,
    }));
  }, [pools, account.address]); // Only recreate when pools or account changes

  // Use memoized contract reads configuration
  const { data: allowancesData } = useReadContracts({
    contracts: allowanceReads,
  });

  // Update allowances when data is fetched
  useEffect(() => {
    if (!allowancesData) return;

    const newAllowances: { [key: string]: number } = {};
    allowancesData.forEach((allowance, index) => {
      if (allowance.result && pools[index]) {
        newAllowances[pools[index].poolAddress] = Number(allowance.result);
      }
    });
    setAllowances(newAllowances);
  }, [allowancesData, pools]);

  // Memoize the join click handler
  const handleJoinClick = useMemo(() => (pool: LotteryPool) => {
    setTokenAddress(pool.contributionToken);
    setAddress(pool.poolAddress);
    const requiredAmount = Number(convertDecimalsToAmount(
      String(pool.contribution),
      pool.decimals
    ));
    setContributionAmount(requiredAmount); 
    if (allowances[pool.poolAddress] > requiredAmount) {
      setIsJoinLotteryPopUpOpen(true);
    } else {
      setIsApproveAmountPopUp(true);
    }
  }, [allowances]); 

  return (
    <div className="min-h-screen py-4">
      <div className="container mx-auto px-4 w-full">
        <div className="w-full">
          {pools.length === 0 ? (
            <div className="text-center text-black dark:text-white py-6">
              <p>No lottery pool created. Get started by clicking the "+" button.</p>
            </div>
          ) : (
            pools.map((pool, index) => (
              <div
                key={pool.poolAddress} // Use pool address as key instead of index
                className="w-full bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[100.5%] mb-2"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-blue-50 dark:bg-blue-900 dark:text-white text-black text-xs font-medium px-1.5 py-0.5 rounded">
                    Pool #{index + 1}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-2 flex-grow">
                    <p className="text-xs text-gray-600 dark:text-white">
                      <span className="font-semibold mb-1 block">Creator:</span>
                      <span className="text-gray-800 text-xs dark:text-white">
                        {`${pool.creator.slice(0, 4)}...${pool.creator.slice(-4)}`}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-white">
                      <span className="font-semibold mb-1 block">Balance:</span>
                      <span className="text-gray-800 text-xs dark:text-white">
                        {convertDecimalsToAmount(
                          String(pool.balance),
                          pool.decimals
                        )} {pool.tokenName}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-white">
                      <span className="font-semibold mb-1 block">
                        Contribution amount:
                      </span>
                      <span className="text-gray-800 text-xs dark:text-white">
                        {convertDecimalsToAmount(
                          String(pool.contribution),
                          pool.decimals
                        )}{" "}
                        {pool.tokenName}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-white">
                      <span className="font-semibold mb-1 block">
                        Pool address:
                      </span>
                      <span className="text-gray-800 text-xs dark:text-white">
                        {`${pool.poolAddress.slice(0, 4)}...${pool.poolAddress.slice(-4)}`}
                      </span>
                    </p>
                  </div>
  
                  <div className="flex flex-col space-y-2 ml-4 w-1/3">
                    <button
                      className="w-auto bg-blue-50 text-black py-2 rounded-md text-xs hover:bg-blue-100 hover:text-black transition-colors"
                      onClick={() => handleJoinClick(pool)}
                    >
                      {allowances[pool.poolAddress] > (Number(convertDecimalsToAmount(
                          String(pool.contribution),
                          pool.decimals
                        )))
                        ? "Join"
                        : "Approve & Join"}
                    </button>
                    <button
                      className="w-auto bg-red-50 text-black py-2 rounded-md text-xs hover:bg-red-100 hover:text-black transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsQuitModalOpen(true);
                        writeContract({
                          abi: lotteryPoolAbi,
                          address: pool.poolAddress,
                          functionName: "rageQuit",
                        });
                      }}
                    >
                      Rage Quit
                    </button>
                    <button
                      className="w-auto bg-green-50 text-black py-2 rounded-md text-xs hover:bg-green-100 hover:text-black transition-colors"
                      onClick={() => {
                        setAddress(pool.poolAddress);
                        setIsPayoutPopupOpen(true);
                      }}
                    >
                      Payout
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Modals */}
          {isQuitModalOpen && (
            <QuitPool
              onClose={() => setIsQuitModalOpen(false)}
              isPending={isPending}
              isSuccess={isSuccess}
              isError={isError}
              hash={hash}
              error={error}
            />
          )}
          {isPayoutPopupOpen && (
            <PayoutLotteryPoolPopup
              onClose={() => setIsPayoutPopupOpen(false)}
              poolAddress={address as `0x${string}`}
            />
          )}
          {isApproveAmountPopUpOpen && (
            <ApproveAmountPopup
              onClose={() => setIsApproveAmountPopUp(false)}
              poolAddress={address as `0x${string}`}
              tokenAddress={tokenAddress as `0x${string}`}
              contributionAmount={contributionAmount}
            />
          )}
          {isJoinLotteryPopUpOpen && (
            <JoinLotteryPoolPopup
              onClose={() => setIsJoinLotteryPopUpOpen(false)}
              poolAddress={address as `0x${string}`}
              tokenAddress={tokenAddress as `0x${string}`}
              contributionAmount={contributionAmount}
            />
          )}
        </div>
      </div>
    </div>
  );
  
};

