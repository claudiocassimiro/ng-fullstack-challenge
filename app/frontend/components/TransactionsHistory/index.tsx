import { useState } from "react";
import { Transactions } from "../../types";
import ButtonSearchTransactionByDate from "../ButtonSearchTransactionsByDate";
import ButtonSearchTransactionsByType from "../ButtonSearchTransactionsByType";
import styles from "./styles.module.css";

interface TransactionsHistoryProps {
  accountId: string;
  token: string;
  showHistory: boolean;
  setShowHistory: (value: boolean) => void;
}

export default function TransactionsHistory({
  accountId,
  token,
  showHistory,
  setShowHistory,
}: TransactionsHistoryProps) {
  const [transactions, setTransactions] = useState<Transactions[]>([]);

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

  const handleAllTransactions = () => {
    setShowHistory(!showHistory);
    getAllTransactions();
  };

  const formatDate = (date: Date) => {
    const dateFormated = new Date(date).toISOString();

    const day = dateFormated.split("T")[0].split("-")[2];
    const month = dateFormated.split("T")[0].split("-")[1];
    const year = dateFormated.split("T")[0].split("-")[0];

    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.TransactionsContainer}>
      {!showHistory ? (
        <div className={styles.TransactionsContainerButtons}>
          <button
            className={styles.TransactionsButton}
            type="button"
            onClick={handleAllTransactions}
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
        <div className={styles.TransactionsHistoryContainer}>
          {transactions
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            ?.map((transaction) => {
              return (
                <div
                  className={styles.TransactionsContainerTransaction}
                  key={transaction.id}
                >
                  <div className={styles.TransactionsContainerInfos}>
                    <span className={styles.TransactionsType}>
                      {transaction.type === "cashOut"
                        ? "Transferência enviada"
                        : "Transferência recebida"}
                    </span>
                    <span className={styles.TransactionsUsername}>
                      {transaction?.username}
                    </span>
                    <span className={styles.TransactionsValue}>
                      {transaction.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className={styles.TransactionsDate}>
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
