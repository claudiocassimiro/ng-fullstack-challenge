export interface WindowSizes {
  width: number;
  height: number;
  isMobile: boolean;
  isHorizontal: boolean;
  isDesktop: boolean;
  isTablet: boolean;
}

export interface UserObject {
  token: string;
  id: string;
  username: string;
  accountId: string;
  status?: number;
  message?: string;
}

export interface Transactions {
  createdAt: Date;
  creditedAccountId: string;
  debitedAccountId: string;
  id: string;
  value: number;
  type?: string;
}
