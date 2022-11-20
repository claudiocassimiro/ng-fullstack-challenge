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
  accountId: string;
  status?: number;
  message?: string;
}
