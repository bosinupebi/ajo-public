export interface LotteryPool {
  creator: `0x${string}`;
  tokenName: string;
  balance: number;
  contributionToken: `0x${string}`;
  contribution: number;
  decimals: number;
  poolAddress: `0x${string}`;
}

export interface SavingsPool {
  creator: string;
  tokenName: string;
  balance: number;
  interval: number;
  admin: string;
  contributionToken: `0x${string}`;
  contribution: number;
  decimals: number;
  poolAddress: `0x${string}`;
  startTime: number;  // Unix timestamp in seconds
}

export interface LotteryPoolsProps {
  pools: LotteryPool[];
}

export interface SavingsPoolsProps {
  pools: SavingsPool[];
}

export interface LotteryPoolPopupProps {
  onClose: () => void;
}

export interface SavingsPoolPopupProps {
  onClose: () => void;
}

export interface TransactionStatusProps {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  hash?: string;
  error?: { message: string } | string | null | undefined;
}

export interface QuitLotteryPoolProps {
  onClose: () => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  hash?: string;
  error?: { message: string } | string | null | undefined;
}

export interface PayoutLotteryPoolProps {
  onClose: () => void;
  poolAddress: `0x${string}`;
}

export interface PayoutSavingsPoolProps {
  onClose: () => void;
  poolAddress: `0x${string}`;
}

export interface ApproveAmountProps {
  onClose: () => void;
  poolAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  contributionAmount: number;
}

export interface JoinLotteryPoolProps {
  onClose: () => void;
  poolAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  contributionAmount: number;
}

export interface ContributeSavingsPoolProps {
  onClose: () => void;
  poolAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  contributionAmount: number;
}

export interface AddMembersProps {
  onClose: () => void;
  poolAddress: `0x${string}`;
}

export interface AddressField {
  value: string;
  isValid: boolean;
}

