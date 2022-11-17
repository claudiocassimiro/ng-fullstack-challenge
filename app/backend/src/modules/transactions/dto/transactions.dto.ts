export type TransactionsDTO = {
  id?: string;
  debitedAccountId: string;
  creditedAccountId: string;
  value: number;
  createdAt?: Date;
};
