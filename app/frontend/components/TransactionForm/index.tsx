import { FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.css";

interface TransactionFormProps {
  username: string;
  accountId: string;
  token: string;
  balance: number;
  getAccountBalance: () => void;
}

export default function TransactionForm({
  username,
  accountId,
  token,
  balance,
  getAccountBalance,
}: TransactionFormProps) {
  const [transactionUsername, setTransactionUsername] = useState("");
  const [transactionValue, setTransactionValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  const handleTransactionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (transactionUsername === username) {
      return setErrorMessage(
        "Você não pode fazer uma transação para você mesmo."
      );
    }

    if (Number(transactionValue) > balance) {
      return setErrorMessage("Saldo insuficiente.");
    }

    const cashoutObject = {
      cashOutUsername: username,
      cashOutAccountId: accountId,
      cashInUsername: transactionUsername,
      balance: Number(transactionValue),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/cashout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(cashoutObject),
        }
      );

      const data = await response.json();

      setSucessMessage(data.message);
      setTransactionUsername("");
      setTransactionValue("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (sucessMessage.length > 1) {
      getAccountBalance();
      setTimeout(() => {
        setSucessMessage("");
      }, 3000);
    }
  }, [sucessMessage]);

  useEffect(() => {
    if (errorMessage.length > 1) {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <form
      onSubmit={(e) => handleTransactionSubmit(e)}
      className={styles.TransactionContainer}
    >
      <div className={styles.TransactionContainerInputs}>
        <input
          required
          className={styles.TransactionInputUsername}
          placeholder="Quem vai receber?"
          type="text"
          name="transactionUsername"
          value={transactionUsername}
          onChange={(e) => setTransactionUsername(e.target.value)}
        />
        <input
          required
          className={styles.TransactionInputValue}
          placeholder="Valor"
          type="number"
          name="transactionValue"
          value={transactionValue}
          onChange={(e) => setTransactionValue(e.target.value)}
        />
      </div>
      {errorMessage.length > 0 ? (
        <p className={styles.TransactionErrorMessage}>{errorMessage}</p>
      ) : null}
      {sucessMessage.length > 0 ? (
        <p className={styles.TransactionSucessMessage}>{sucessMessage}</p>
      ) : null}
      <button className={styles.TransactionSubmitButton} type="submit">
        Enviar
      </button>
    </form>
  );
}
