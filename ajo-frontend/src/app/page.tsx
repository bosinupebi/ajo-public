"use client";
import React from "react";

export default function Page() {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <a
        href="/explore"
        className="absolute top-2 right-2 px-2 py-2 bg-blue-50 dark:bg-blue-900 text-black dark:text-white rounded-lg font-sans text-sm"
      >
        Explore
      </a>

      <div className="text-center space-y-4 max-w-lg px-4">
        <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
          "Ajo" is a Yoruba word that translates to "group or organisational
          savings"
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Pool your ERC-20 tokens and have full control of your crypto assets.
        </p>
      </div>
    </div>
  );
}
