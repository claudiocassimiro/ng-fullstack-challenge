import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

      setBalance(formatedBalance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccountBalance();
  }, [token]);

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
          <h1
            className={styles.AccountGreeatingMessage}
          >{`Olá, ${username}!`}</h1>
          <div className={styles.AccountBalanceDisplay}>
            <span className={styles.AccountBalance}>{balance}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
