import { useState } from "react";
import { Transactions } from "../../types";
import styles from "./styles.module.css";

interface ButtonSearchTransactionByDate {
  token: string;
  accountId: string;
  showByDate: boolean;
  setShowByDate: (value: boolean) => void;
  setTransactions: (value: Transactions[]) => void;
  setShowTable: (value: boolean) => void;
}

export default function ButtonSearchTransactionByDate({
  token,
  accountId,
  showByDate,
  setShowByDate,
  setTransactions,
  setShowTable,
}: ButtonSearchTransactionByDate) {
  const [date, setDate] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const getAllTransactionsByDate = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/bydate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ accountId, date }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (transactionType) {
        console.log("type", transactionType);
        const filteredTransaction = data.filter(
          (transaction: Transactions) => transaction.type === transactionType
        );

        setTransactions(filteredTransaction);
      } else {
        setTransactions(data);
      }

      setDate("");
      setTransactionType("");
      setShowTable(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <button
        className={styles.ButtonSearchTransactionsButton}
        type="button"
        onClick={() => setShowByDate(!showByDate)}
      >
        Ver transações por data
      </button>
      {showByDate ? (
        <div className={styles.ButtonSearchTransactionsContainerConfig}>
          <div className={styles.ButtonSearchTransactionsContainerInput}>
            <input
              className={styles.ButtonSearchTransactionsDateInput}
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <p className={styles.ButtonSearchTransactionsAlertText}>
              Se você quiser buscar por data e tipo da transação, marque uma das
              opções abaixo.
            </p>

            <label
              className={styles.ButtonSearchTransactionsRadioLabel}
              htmlFor="cashout"
            >
              <input
                id="cashout"
                type="radio"
                value="cashOut"
                onChange={(e) => setTransactionType(e.target.value)}
              />
              CashOut
            </label>

            <label
              className={styles.ButtonSearchTransactionsRadioLabel}
              htmlFor="cashin"
            >
              <input
                id="cashin"
                type="radio"
                value="cashIn"
                onChange={(e) => setTransactionType(e.target.value)}
              />
              CashIn
            </label>
          </div>
          <button
            className={styles.ButtonSearchTransactionsActionButton}
            type="button"
            onClick={getAllTransactionsByDate}
          >
            Buscar Transações por data
          </button>
        </div>
      ) : null}
    </>
  );
}
