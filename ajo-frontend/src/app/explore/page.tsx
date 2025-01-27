"use client";
import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useReadContracts } from "wagmi";
import LotteryPools from "@/components/lotterypools";
import SavingsPools from "@/components/savingspools";
import SavingsPoolPopup from "@/components/createsavingspool";
import LotteryPoolPopup from "@/components/createlotterypool";
import { LookupAbi } from "@/abi";
import { LotteryPool, SavingsPool } from "@/constants";
import { useChainAddresses } from "@/util";
import { classic, mainnet } from "wagmi/chains";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"lotteryPools" | "savingsPools">(
    "lotteryPools"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLotteryPopupOpen, setIsLotteryPopupOpen] = useState(false);
  const [isSavingsPopupOpen, setIsSavingsPopupOpen] = useState(false);

  const account = useAccount();
  const { factoryAddress, lookupAddress } = useChainAddresses(account.chainId);
  const lookUpContract = {
    address: lookupAddress as `0x${string}`,
    abi: LookupAbi,
  } as const;

  const {
    data: pools,
    isError,
    isLoading,
  } = useReadContracts({
    contracts: [
      {
        ...lookUpContract,
        functionName: "getLotteryPoolData",
        args: [factoryAddress as `0x${string}`],
      },
      {
        ...lookUpContract,
        functionName: "getSavingsPoolData",
        args: [factoryAddress as `0x${string}`],
      },
    ],
  });

  const lotteryPools: LotteryPool[] = useMemo(
    () =>
      pools?.[0]?.status === "success"
        ? pools[0].result.map((pool) => ({
            creator: pool.creator as `0x${string}`,
            tokenName: pool.tokenName || "Unnamed Pool",
            balance: Number(pool.balance),
            contributionToken: pool.contributionToken as `0x${string}`,
            decimals: Number(pool.decimals),
            contribution: Number(pool.contribution),
            poolAddress: pool.poolAddress,
          }))
        : [],
    [pools]
  );

  const savingsPools: SavingsPool[] = useMemo(
    () =>
      pools?.[1]?.status === "success"
        ? pools[1].result.map((pool) => ({
            creator: pool.administrator,
            tokenName: pool.tokenName,
            balance: Number(pool.balance),
            interval: Number(pool.interval),
            admin: pool.administrator,
            contributionToken: pool.contributionToken as `0x${string}`,
            contribution: Number(pool.contribution),
            decimals: Number(pool.decimals),
            poolAddress: pool.poolAddress,
            startTime: Number(pool.startTime),  
          }))
        : [],
    [pools]
  );

  const filteredLotteryPools = useMemo(
    () =>
      lotteryPools.filter(
        (pool) =>
          pool.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.creator.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [lotteryPools, searchQuery]
  );

  const filteredSavingsPools = useMemo(
    () =>
      savingsPools.filter(
        (pool) =>
          pool.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.creator.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [savingsPools, searchQuery]
  );

  const handleCloseLotteryPopup = () => setIsLotteryPopupOpen(false);
  const handleCloseSavingsPopup = () => setIsSavingsPopupOpen(false);

  const handleOpenPopup = () => {
    if (activeTab === "lotteryPools") {
      setIsLotteryPopupOpen(true);
    } else {
      setIsSavingsPopupOpen(true);
    }
  };

  function LoadingState() {
    return (
      <div className="relative h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900" >
        <p className="text-xl font-medium text-black dark:text-white">Loading...</p>
      </div>
    );
  }

  function ConnectWallet() {
    return (
      <div className="relative h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 ">
        <p className="text-xl font-medium text-black dark:text-white">
          Please connect your wallet.
        </p>
      </div>
    );
  }

  function ChainNotSupported() {
    return (
      <div className="relative h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 ">
        <p className="text-xl font-medium text-black dark:text-white">
          This frontend does not support the current connected chain.<br />
          Supported chains are {classic.name} and {mainnet.name}. 
        </p>
      </div>
    );
  }

  if (!account.address) {
    return <ConnectWallet />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="relative h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-xl font-medium text-black">Error fetching pools.</p>
      </div>
    );
  }

  if(account.chainId !== classic.id && account.chainId !== mainnet.id){ 
    return (<ChainNotSupported />); 
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="ml-4 mr-4 flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50 text-black w-full"
            placeholder="Search for a pool"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m-3.65.85a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
            />
          </svg>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab("lotteryPools")}
              className={`px-2 py-2 mr-2 rounded-md transition-colors ${
                activeTab === "lotteryPools"
                  ? "bg-blue-50 text-black text-md dark:bg-blue-900 dark:text-white "
                  : "text-black text-md dark:bg-gray-900 dark:text-white"
              }`}
            >
              Lottery
            </button>
            <button
              onClick={() => setActiveTab("savingsPools")}
              className={`px-2 py-2 rounded-md transition-colors ${
                activeTab === "savingsPools"
                  ? "bg-blue-50 text-black text-md dark:bg-blue-900 dark:text-white"
                  : "text-black text-md dark:bg-gray-900 dark:text-white "
              }`}
            >
              Savings
            </button>
          </div>
          <button
            className="text-lg font-bold dark:text-white"
            title={
              activeTab === "lotteryPools"
                ? "Create lottery pool"
                : "Create savings pool"
            }
            onClick={handleOpenPopup}
          >
            +
          </button>
        </div>
      </div>

      {/* Pools Display */}
      <div>
        {activeTab === "lotteryPools" ? (
          <LotteryPools pools={filteredLotteryPools} />
        ) : (
          <SavingsPools pools={filteredSavingsPools} />
        )}
      </div>

      {/* Popups */}
      {isLotteryPopupOpen && (
        <LotteryPoolPopup onClose={handleCloseLotteryPopup} />
      )}
      {isSavingsPopupOpen && (
        <SavingsPoolPopup onClose={handleCloseSavingsPopup} />
      )}
    </div>
  );
}
