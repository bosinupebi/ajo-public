import React from "react";
import { ApproveAmountProps } from "@/constants";
import { useState, useEffect } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { erc20Abi } from "@/abi";
import TransactionStatus from "./transactionstatus";
import { convertAmountToDecimals } from "@/util";

export default function ApproveAmountPopup({
  onClose,
  poolAddress,
  tokenAddress,
  contributionAmount,
}: ApproveAmountProps) {
  const [amount, setAmount] = useState("");
  const handleAmountChange = (event: { target: { value: string } }) => {
    setAmount(event.target.value);
    setIsValid(parseFloat(event.target.value) > contributionAmount);
  };
  const [isValid, setIsValid] = useState(false);
  const [decimals, setDecimals] = useState(18);
  const { data: tokenDecimals } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: "decimals",
  });
  useEffect(() => {
    if (tokenDecimals !== undefined) {
      setDecimals(tokenDecimals);
    }
  }, [tokenDecimals]);
  const {
    writeContract,
    isPending,
    isError,
    isSuccess,
    error,
    data: hash,
  } = useWriteContract();
  return (
    <div className="min-h-screen w-full fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-hidden p-0 m-0">
      <div className="bg-white p-6 rounded-md shadow-lg relative w-80 sm:w-96 dark:bg-gray-900">
        <button
          className="absolute top-2 right-2 text-black hover:text-gray-800 dark:text-white"
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
              Approve spend
            </h2>
            <form className="flex flex-col w-full">
              <div className="w-full space-y-4">
                <div>
                  <label className="flex items-center text-black text-left mb-1 dark:text-white">
                    Approval Amount
                    <span className="ml-1 relative group">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full border border-black text-black text-xs font-bold cursor-help dark:border-white dark:text-white">
                        ?
                      </span>
                      <span
                        className="absolute left-full top-1/2 bg-gray-700 text-white text-xs rounded px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ width: "200px", whiteSpace: "normal" }}
                      >
                        Amount to allow the pool contract spend from your wallet
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-50"
                    placeholder="Enter an amount"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`bg-blue-50 text-black px-4 py-2 rounded mt-6 w-full transition-colors dark:bg-blue-900 dark:text-white ${
                  !isValid ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  writeContract({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [
                      poolAddress,
                      BigInt(convertAmountToDecimals(amount, decimals)),
                    ],
                  });
                }}
                disabled={!isValid}
              >
                Approve
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
