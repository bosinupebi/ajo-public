import React from "react";
import { TransactionStatusProps } from "@/constants";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useChainAddresses } from "@/util";

export default function TransactionStatus({
  isPending,
  isSuccess,
  isError,
  hash,
  error,
}: TransactionStatusProps) {
  const errorDetails =
    typeof error === "object" && error?.message
      ? error.message.match(/Details:\s*(.+)/)?.[1] || error.message
      : typeof error === "string"
        ? error.match(/Details:\s*(.+)/)?.[1] || error
        : "Unknown error";

  const {
    isError: isReceiptError,
    isPending: isReceiptPending,
    isSuccess: isReceiptSuccess,
  } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
  });

  const account = useAccount();
  const { blockExplorer } = useChainAddresses(account.chainId);

  return (
    <div className="transaction-status">
      {isPending && (
        <p className="text-center dark:text-white">
          Waiting for confirmation...
        </p>
      )}

      {isSuccess && isReceiptPending && (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-black text-center dark:text-white">
            Transaction submitted! Waiting for confirmation.
          </p>
          {hash && (
            <p className="text-sm text-center">
              <a
                href={`https://etc.blockscout.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline dark:text-white"
              >
                View Transaction
              </a>
            </p>
          )}
        </div>
      )}

      {isSuccess && isReceiptSuccess && (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <p className="text-black text-center dark:text-white">
            Transaction confirmed!
          </p>
          {hash && (
            <p className="text-sm text-center">
              <a
                href={`${blockExplorer}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline dark:text-white"
              >
                View Transaction
              </a>
            </p>
          )}
        </div>
      )}

      {isSuccess && isReceiptError && (
        <div className="flex flex-col items-center gap-2">
          <XCircle className="h-8 w-8 text-red-500" />
          <p className="text-black text-center dark:text-white">
            Transaction failed!
          </p>
          {hash && (
            <p className="text-sm text-center">
              <a
                href={`${blockExplorer}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline dark:text-white"
              >
                View Transaction
              </a>
            </p>
          )}
        </div>
      )}

      {isError && (
        <>
          <p className="text-red-700 text-md text-center mb-2">
            Transaction Failed:
          </p>
          <p className="text-black text-sm text-center dark:text-white">
            {errorDetails}
          </p>
          {hash && (
            <p className="text-sm text-center">
              Transaction Hash:{" "}
              <a
                href={`https://etc.blockscout.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline dark:text-blue-900"
              >
                {hash}
              </a>
            </p>
          )}
        </>
      )}
    </div>
  );
}
