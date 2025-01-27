import { ethers } from "ethers";
import { SavingsPool } from "./constants";
import { classic, mainnet } from "wagmi/chains";

export const convertIntervalToSeconds = (intervalInDays: number): number => {
  return intervalInDays * 86400;
};
export const convertAmountToDecimals = (
  amount: string,
  decimals: number
): string => {
  return amount ? ethers.parseUnits(amount, decimals).toString() : "0";
};
export const convertSecondsToDays = (intervalInSeconds: number): number => {
  return intervalInSeconds / 86400;
};
export const convertDecimalsToAmount = (
  amount: string,
  decimals: number
): string => {
  return amount ? ethers.formatUnits(amount, decimals) : "0";
};
export function processSavingsPools(pools: any[]): SavingsPool[] {
  return pools?.[1]?.status === "success"
    ? pools[1].result.map((pool: any) => ({
        creator: pool.administrator,
        tokenName: pool.tokenName,
        balance: Number(pool.balance),
        interval: Number(pool.interval),
        admin: pool.administrator,
        contributionToken: pool.contributionToken as `0x${string}`,
        contribution: Number(pool.contribution),
        decimals: Number(pool.decimals),
        poolAddress: pool.poolAddress,
      }))
    : [];
}
export function getChainAddresses(chainId: number) {
  const factoryAddresses: Record<number, string | null> = {
    [classic.id]: process.env.NEXT_PUBLIC_CLASSIC_FACTORY_ADDRESS || null,
    [mainnet.id]: process.env.NEXT_PUBLIC_MAINNET_FACTORY_ADDRESS || null,
  };

  const lookupAddresses: Record<number, string | null> = {
    [classic.id]: process.env.NEXT_PUBLIC_CLASSIC_LOOKUP_ADDRESS || null,
    [mainnet.id]: process.env.NEXT_PUBLIC_MAINNET_LOOKUP_ADDRESS || null,
  };

  const blockExplorers: Record<number, string | null> = {
    [classic.id]: classic.blockExplorers.default.url || null,
    [mainnet.id]: mainnet.blockExplorers.default.url || null,
  };

  return {
    factoryAddress: factoryAddresses[chainId],
    lookupAddress: lookupAddresses[chainId],
    blockExplorer: blockExplorers[chainId],
  };
}
export function useChainAddresses(chainId: number | undefined) {
  if (chainId) {
    return getChainAddresses(chainId);
  }
  return {
    factoryAddress: "",
    lookupAddress: "",
    blockExplorer: "",
  };
}
export function dateStringToUnixTimestamp(dateString: string): bigint{
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
  }
  return BigInt(Math.floor(date.getTime() / 1000));
}
export function unixTimeStampToDateString(unixTimeStamp: string): string {
  const timestamp = parseInt(unixTimeStamp);
  if (isNaN(timestamp)) {
    throw new Error("Invalid Unix timestamp");
  }
  const date = new Date(timestamp * 1000);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  // Format the date using `Intl.DateTimeFormat`
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
