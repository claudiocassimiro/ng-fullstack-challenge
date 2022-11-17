export enum TransactionCashtype {
  cashOut = 'cashOut',
  cashIn = 'cashIn',
}

export type Transactions = {
  accountId: string;
};

export type TransactionsByType = Transactions & {
  type: TransactionCashtype;
};

export type TransactionsByDate = Transactions & {
  date: string;
};
