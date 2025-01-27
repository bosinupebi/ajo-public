import React from "react";
import { SavingsPoolPopupProps } from "@/constants";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { factoryAbi, erc20Abi } from "@/abi";
import {
  convertIntervalToSeconds,
  convertAmountToDecimals,
  useChainAddresses,
} from "@/util";
import TransactionStatus from "./transactionstatus";

export default function SavingsPoolPopup({ onClose }: SavingsPoolPopupProps) {
  const [isValid, setIsValid] = useState(false);
  const [address, setAddress] = useState("");
  const account = useAccount();
  const { factoryAddress } = useChainAddresses(account.chainId);
  const {
    writeContract,
    isPending,
    isError,
    isSuccess,
    error,
    data: hash,
  } = useWriteContract();
  const [decimals, setDecimals] = useState(18);
  const [interval, setInterval] = useState("");
  const [amount, setAmount] = useState("");
  const { data: tokenDecimals } = useReadContract({
    abi: erc20Abi,
    address: address as `0x${string}`,
    functionName: "decimals",
  });
  const handleAddressChange = (event: { target: { value: string } }) => {
    const value = event.target.value;
    setAddress(value);
    setIsValid(ethers.isAddress(value));
  };
  useEffect(() => {
    if (tokenDecimals !== undefined) {
      setDecimals(tokenDecimals);
    }
  }, [tokenDecimals]);

  const handleIntervalChange = (event: { target: { value: string } }) => {
    setInterval(event.target.value);
  };

  const handleAmountChange = (event: { target: { value: string } }) => {
    setAmount(event.target.value);
  };

  return (
    <div className="min-h-screen w-full fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-hidden p-0 m-0">
      <div className="bg-white p-6 rounded-md shadow-lg relative w-80 sm:w-96 dark:bg-gray-900">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-white"
          onClick={onClose}
        >
          x
        </button>

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
              Create a savings pool
            </h2>
            <form className="flex flex-col w-full">
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-gray-700 text-left mb-1 dark:text-white">
                    Contribution token address:
                  </label>
                  {address && !isValid && (
                    <p className="text-red-700 text-sm text-left mt-1">
                      Invalid ethereum address.
                    </p>
                  )}
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-50"
                    placeholder="Enter ERC-20 token address"
                    value={address}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-black text-left mb-1 dark:text-white">
                    Contribution interval:
                    <span className="ml-1 relative group">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full border border-black text-black text-xs font-bold cursor-help dark:text-white dark:border-white">
                        ?
                      </span>
                      <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Interval in days between contributions
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-50"
                    placeholder="Enter interval"
                    value={interval}
                    onChange={handleIntervalChange}
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-black text-left mb-1 dark:text-white">
                    Contribution token amount:
                    <span className="ml-1 relative group ">
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
                    className="w-full border rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-50"
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
                    functionName: "createSavingsPool",
                    args: [
                      address as `0x${string}`,
                      BigInt(convertIntervalToSeconds(Number(interval))),
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
