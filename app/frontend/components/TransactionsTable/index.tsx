import { useState } from "react";
import { Transactions } from "../../types";
import ButtonSearchTransactionByDate from "../ButtonSearchTransactionsByDate";
import ButtonSearchTransactionsByType from "../ButtonSearchTransactionsByType";
import styles from "./styles.module.css";

interface TransactionsTableProps {
  accountId: string;
  token: string;
}

export default function TransactionsTable({
  accountId,
  token,
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transactions[]>();
  const [showTable, setShowTable] = useState(false);
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
      {!showTable ? (
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
            setShowTable={setShowTable}
          />

          <ButtonSearchTransactionsByType
            token={token}
            accountId={accountId}
            setTransactions={setTransactions}
            setShowTable={setShowTable}
          />
        </div>
      ) : (
        <h1 style={{ color: "white" }}>{transactions?.length}</h1>
      )}
    </div>
  );
}
