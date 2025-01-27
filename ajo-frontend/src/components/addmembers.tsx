import React from "react";
import { AddMembersProps, AddressField } from "@/constants";
import { useState } from "react";
import { useWriteContract} from "wagmi";
import { savingsPoolAbi } from "@/abi";
import TransactionStatus from "./transactionstatus";
import { ethers } from "ethers";
import { Plus, X } from "lucide-react";

export default function AddMembers({ onClose, poolAddress }: AddMembersProps) {
  const [addresses, setAddresses] = useState<AddressField[]>([
    { value: "", isValid: false },
  ]);

  const {
    writeContract,
    isPending,
    isError,
    isSuccess,
    error,
    data: hash,
  } = useWriteContract();

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = {
      value,
      isValid: ethers.isAddress(value),
    };
    setAddresses(newAddresses);
  };

  const addNewAddressField = () => {
    setAddresses([...addresses, { value: "", isValid: false }]);
  };

  const removeAddressField = (index: number) => {
    if (addresses.length > 1) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
    }
  };

  const areAllAddressesValid = addresses.every((addr) => addr.isValid);
  const validAddresses = addresses.map((addr) => addr.value);

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
            <h2 className="text-lg font-bold mb-6 text-center dark:text-white">Add Members</h2>
            <form className="flex flex-col w-full">
              <div className="w-full space-y-4">
                {addresses.map((address, index) => (
                  <div key={index}>
                    <label className="flex items-center text-black text-left mb-1 dark:text-white">
                      Member Address
                      <span className="ml-1 relative group">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full border border-black text-black text-xs font-bold cursor-help dark:border-white dark:text-white"> 
                          ?
                        </span>
                        <span
                          className="absolute left-full top-1/2 bg-gray-700 text-white text-xs rounded px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Ethereum address of member
                        </span>
                      </span>
                    </label>
                    {address.value && !address.isValid && (
                      <p className="text-red-700 text-sm text-left mt-1">
                        Invalid ethereum address.
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-50"
                        placeholder="Enter an ethereum address"
                        value={address.value}
                        onChange={(e) => handleAddressChange(index, e.target.value)}
                        required
                      />
                      {index === addresses.length - 1 && (
                        <button
                          type="button"
                          onClick={addNewAddressField}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Plus size={20} className="text-green-500" />
                        </button>
                      )}
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddressField(index)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <X size={20} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className={`bg-blue-50 text-black px-4 py-2 rounded mt-6 w-full transition-colors dark:text:white dark:bg-blue-900 ${
                  !areAllAddressesValid
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  writeContract({
                    abi: savingsPoolAbi,
                    address: poolAddress as `0x${string}`,
                    functionName: "addMembers",
                    args: [validAddresses as `0x${string}`[]],
                  });
                }}
                disabled={!areAllAddressesValid}
              >
                Add Members
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

