import React from "react";
import { LotteryPoolPopupProps } from "@/constants";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { factoryAbi, erc20Abi } from "@/abi";
import { convertAmountToDecimals, useChainAddresses } from "@/util";
import TransactionStatus from "./transactionstatus";

export default function LotteryPoolPopup({ onClose }: LotteryPoolPopupProps) {
  const [isValid, setIsValid] = useState(false);
  const [address, setAddress] = useState("");
  const account = useAccount();
  const { factoryAddress } = useChainAddresses(account.chainId);
  const [decimals, setDecimals] = useState(18);
  const [amount, setAmount] = useState("");

  const handleAddressChange = (event: { target: { value: string } }) => {
    const value = event.target.value;
    setAddress(value);
    setIsValid(ethers.isAddress(value));
  };
  const {
    writeContract,
    isPending,
    isError,
    isSuccess,
    error,
    data: hash,
  } = useWriteContract();
  const { data: tokenDecimals } = useReadContract({
    abi: erc20Abi,
    address: address as `0x${string}`,
    functionName: "decimals",
  });
  useEffect(() => {
    if (tokenDecimals !== undefined) {
      setDecimals(tokenDecimals);
    }
  }, [tokenDecimals]);
  const handleAmountChange = (event: { target: { value:string } }) => {
    setAmount(event.target.value);
  };
  return (
    <div className="min-h-screen w-full fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-hidden p-0 m-0">
      <div className="bg-white p-6 rounded-md shadow-lg relative w-80 sm:w-96 dark:bg-gray-900">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          x
        </button>{" "}
        <TransactionStatus
          isPending={isPending}
          isSuccess={isSuccess}
          isError={isError}
          hash={hash}
          error={error ?? null}
        />
        {!isPending && !isSuccess && !isError && (
          <div>
            <h2 className="text-lg font-bold mb-6 text-center dark:text-white">
              Create a lottery pool
            </h2>
            <form className="flex flex-col w-full">
              <div className="w-full space-y-4">
                <div>
                  <label className="flex items-center text-black text-left mb-1 dark:text-white">
                    Contribution token address
                    <span className="ml-1 relative group">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full border border-black text-black text-xs font-bold cursor-hel dark:text-white dark:border-white">
                        ?
                      </span>
                      <span className="absolute left-full top-1/2  bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        ERC-20 token address
                      </span>
                    </span>
                  </label>
                  {address && !isValid && (
                    <p className="text-red-700 text-sm text-left mt-1">
                      Invalid ethereum address.
                    </p>
                  )}
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-50"
                    placeholder="Enter ERC-20 token address"
                    value={address}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-black text-left mb-1 dark:text-white">
                    Contribution token amount:
                    <span className="ml-1 relative group">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full border border-black text-black text-xs font-bold cursor-help dark:text-white dark:border-white">
                        ?
                      </span>
                      <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Minimum amount for contribution
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-50"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`bg-blue-50 text-black px-4 py-2 rounded mt-6 w-full transition-colors dark:bg-blue-900 dark:text-white${
                  !isValid ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""
                }`}
                disabled={!isValid}
                onClick={(e) => {
                  e.preventDefault();
                  writeContract({
                    abi: factoryAbi,
                    address: factoryAddress as `0x${string}`,
                    functionName: "createLotteryPool",
                    args: [
                      address as `0x${string}`,
                      BigInt(convertAmountToDecimals(String(amount), decimals)),
                    ],
                  });
                }}
              >
                Create
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
