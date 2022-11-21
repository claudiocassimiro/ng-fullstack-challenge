import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "../styles/Account.module.css";
import { useWindowSize } from "../utils/helpers";

export default function Account() {
  const initialUserObject = {
    id: ``,
    username: ``,
    accountId: ``,
  };

  const [userObject, setUserObject] = useState(initialUserObject);
  const [token, setToken] = useState("");
  const [transactionUsername, setTransactionUsername] = useState("");
  const [transactionValue, setTransactionValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");
  const [formattedBalance, setFormatedBalance] = useState("");
  const [balance, setBalance] = useState(0);
  const { isDesktop } = useWindowSize();
  const [tokenCookie, , removeTokenCookie] = useCookies(["token"]);
  const [userCookie, , removeUserCookie] = useCookies(["userObject"]);
  const router = useRouter();

  const logout = () => {
    removeTokenCookie("token");
    removeUserCookie("userObject");

    router.push("/");
  };

  useEffect(() => {
    if (!tokenCookie.token) {
      router.push("/login");
    }

    setUserObject(userCookie.userObject);
    setToken(tokenCookie.token);
  }, []);

  const { username, accountId } = userObject;

  const getAccountBalance = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/balance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ id: accountId }),
        }
      );

      const data = await response.json();

      const formatedBalance = data.balance.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      setBalance(data.balance);
      setFormatedBalance(formatedBalance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccountBalance();
  }, [token]);

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
    <div className={styles.AccountContainer}>
      <header className={styles.AccountHeader}>
        <div className={styles.AccountHeaderContainer}>
          <Image
            src="/images/logo-ngcash.svg"
            alt="logo ngcash"
            width={isDesktop ? 160 : 120}
            height={isDesktop ? 48 : 38}
          />
          <div className={styles.AccountButtonContainer}>
            <a className={styles.AccountLogoutButton} onClick={logout}>
              Logout
            </a>
          </div>
        </div>
      </header>
      <main className={styles.AccountMainContainer}>
        <div className={styles.AccountDataContainer}>
          <p className={styles.AccountText}>{`Olá, ${username}!`}</p>
          <div className={styles.AccountBalanceDisplay}>
            <span className={styles.AccountBalance}>{formattedBalance}</span>
          </div>
        </div>
        <div className={styles.AccountDataContainer}>
          <p className={styles.AccountText}>{`Área de transferências`}</p>
          <form
            onSubmit={(e) => handleTransactionSubmit(e)}
            className={styles.AccountTransactionContainer}
          >
            <div className={styles.AccountContainerInputs}>
              <input
                required
                className={styles.AccountTransactionInputUsername}
                placeholder="Quem vai receber?"
                type="text"
                name="transactionUsername"
                value={transactionUsername}
                onChange={(e) => setTransactionUsername(e.target.value)}
              />
              <input
                required
                className={styles.AccountTransactionInputValue}
                placeholder="Valor"
                type="number"
                name="transactionValue"
                value={transactionValue}
                onChange={(e) => setTransactionValue(e.target.value)}
              />
            </div>
            {errorMessage.length > 0 ? (
              <p className={styles.AccountErrorMessage}>{errorMessage}</p>
            ) : null}
            {sucessMessage.length > 0 ? (
              <p className={styles.AccountSucessMessage}>{sucessMessage}</p>
            ) : null}
            <button
              className={styles.AccountSubmitTransactionButton}
              type="submit"
            >
              Enviar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
