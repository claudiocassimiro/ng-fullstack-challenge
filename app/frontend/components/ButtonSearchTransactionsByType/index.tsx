import { useState } from "react";
import { Transactions } from "../../types";
import styles from "./styles.module.css";

interface ButtonSearchTransactionsByTypeProps {
  token: string;
  accountId: string;
  setTransactions: (value: Transactions[]) => void;
  setShowHistory: (value: boolean) => void;
}

export default function ButtonSearchTransactionsByType({
  token,
  accountId,
  setTransactions,
  setShowHistory,
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
      setShowHistory(true);
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
        data-testid="open-transaction-by-type"
        onClick={() => setShowByType(!showByType)}
      >
        Ver transações por tipo
      </button>
      {showByType ? (
        <div
          data-testid="transactions-by-type"
          className={styles.ButtonSearchTransactionsContainerConfig}
        >
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
            <p
              data-testid="error-message"
              className={styles.ButtonSearchErrorMessage}
            >
              {errorMessage}
            </p>
          ) : null}

          <button
            className={styles.ButtonSearchTransactionsActionButton}
            type="button"
            data-testid="search-by-transactions"
            onClick={getAllTransactionsByType}
          >
            Buscar Transações por tipo
          </button>
        </div>
      ) : null}
    </>
  );
}
