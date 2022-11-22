import { useState } from "react";
import { Transactions } from "../../types";
import ButtonSearchTransactionByDate from "../ButtonSearchTransactionsByDate";
import ButtonSearchTransactionsByType from "../ButtonSearchTransactionsByType";
import styles from "./styles.module.css";

interface TransactionsHistoryProps {
  accountId: string;
  token: string;
}

export default function TransactionsHistory({
  accountId,
  token,
}: TransactionsHistoryProps) {
  const [transactions, setTransactions] = useState<Transactions[]>();
  const [showHistory, setShowHistory] = useState(false);
  const getAllTransactions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/all`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ accountId }),
        }
      );

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.TransactionsContainer}>
      {!showHistory ? (
        <div className={styles.TransactionsContainerButtons}>
          <button
            className={styles.TransactionsButton}
            type="button"
            onClick={getAllTransactions}
          >
            Ver todas as transações
          </button>

          <ButtonSearchTransactionByDate
            token={token}
            accountId={accountId}
            setTransactions={setTransactions}
            setShowHistory={setShowHistory}
          />

          <ButtonSearchTransactionsByType
            token={token}
            accountId={accountId}
            setTransactions={setTransactions}
            setShowHistory={setShowHistory}
          />
        </div>
      ) : (
        <h1 style={{ color: "white" }}>{transactions?.length}</h1>
      )}
    </div>
  );
}
