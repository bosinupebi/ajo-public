import TransactionStatus from "./transactionstatus";
import { QuitLotteryPoolProps } from "@/constants";




export default function QuitPool({
  onClose,
  isPending,
  isSuccess,
  isError,
  hash,
  error,
}: QuitLotteryPoolProps) {
  return (
    <div className="min-h-screen w-full fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-hidden p-0 m-0">
      <div className="bg-white p-6 rounded-md shadow-lg relative w-80 sm:w-96 dark:bg-gray-900">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-white"
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
      </div>
    </div>
  );
};


