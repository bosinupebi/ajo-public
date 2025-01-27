"use client";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import {useRouter } from "next/navigation";
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const specificConnector = connectors.find(
    (connector:Connector) => connector.id === "injected"
  );
  return (
    <div className="flex flex-col bg-white min-h-screen dark:bg-gray-900">
      {/* Menu Bar */}
      <div className="w-full py-2 px-2 flex justify-between items-center border-b border-gray-150 dark:text-white">
        {/* Home Button */}
        <div
          className="text-md font-large cursor-pointer hover:text-gray-600 px-2 py-2 "
          onClick={() => router.push("/")}
        >
          Home
        </div>

        {/* Wallet Buttons */}
        <div className="flex items-center absolute top-2 right-4">
          {specificConnector && (
            <button
              className="px-2 py-2 bg-blue-50 text-black rounded-lg font-sans text-sm relative dark:bg-blue-900 dark:text-white"
              key={specificConnector.uid}
              onClick={() => connect({ connector: specificConnector })}
              type="button"
            >
              {account.address
                ? `${account.address.slice(0, 4)}...${account.address.slice(-4)}`
                : "Connect Wallet"}
            </button>
          )}
          {account.address && (
            <button
              className="ml-2 px-2 py-2 text-blue rounded-full font-sans text-sm flex justify-center items-center relative "
              onClick={() => disconnect()}
              type="button"
              title="Disconnect"
            >
              <FaSignOutAlt size={18} className="text-black dark:text-white" /> {/* Leave/Exit symbol */}
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                Disconnect
              </span>
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
