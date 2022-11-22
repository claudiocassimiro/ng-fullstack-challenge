import { useState } from "react";
import { Transactions } from "../../types";
import styles from "./styles.module.css";

interface ButtonSearchTransactionsByTypeProps {
  token: string;
  accountId: string;
  setTransactions: (value: Transactions[]) => void;
  setShowTable: (value: boolean) => void;
}

export default function ButtonSearchTransactionsByType({
  token,
  accountId,
  setTransactions,
  setShowTable,
}: ButtonSearchTransactionsByTypeProps) {
  const [showByType, setShowByType] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const getAllTransactionsByType = async () => {
    if (!transactionType) {
      return setErrorMessage("Please choose a type.");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/bytype`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ accountId, type: transactionType }),
        }
      );

      const data = await response.json();

      setTransactions(data);
      setShowTable(true);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(transactionType);

  return (
    <>
      <button
        className={styles.ButtonSearchTransactionsButton}
        type="button"
        onClick={() => setShowByType(!showByType)}
      >
        Ver transações por tipo
      </button>
      {showByType ? (
        <div className={styles.ButtonSearchTransactionsContainerConfig}>
          <div className={styles.ButtonSearchTransactionsContainerInput}>
            <label
              className={styles.ButtonSearchTransactionsRadioLabel}
              htmlFor="cashout"
            >
              <input
                id="cashout"
                type="radio"
                name="type"
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
                name="type"
                value="cashIn"
                onChange={(e) => setTransactionType(e.target.value)}
              />
              CashIn
            </label>
          </div>

          {errorMessage.length > 0 ? (
            <p className={styles.ButtonSearchErrorMessage}>{errorMessage}</p>
          ) : null}

          <button
            className={styles.ButtonSearchTransactionsActionButton}
            type="button"
            onClick={getAllTransactionsByType}
          >
            Buscar Transações por tipo
          </button>
        </div>
      ) : null}
    </>
  );
}
