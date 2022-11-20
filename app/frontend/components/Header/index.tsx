import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useWindowSize } from "../../utils/helpers";
import styles from "./styles.module.css";
import cn from "classnames";

export default function Header() {
  const [cookie] = useCookies(["token"]);
  const { isDesktop } = useWindowSize();
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    setToken(cookie.token);
  }, [cookie]);
  return (
    <header className={styles.header}>
      <div className={styles.HeaderContainer}>
        <Image
          src="/images/logo-ngcash.svg"
          alt="logo ngcash"
          width={isDesktop ? 160 : 120}
          height={isDesktop ? 48 : 38}
        />
        <div
          className={cn(styles.HeaderContainerButtons, {
            [styles.HeaderContainerButton]: token,
          })}
        >
          {token ? (
            <a
              data-testid="button-go-to-account"
              className={styles.HeaderButton}
              onClick={() => router.push("/account")}
            >
              Ir para conta
            </a>
          ) : (
            <div data-testid="container-login-and-sign-in-buttons">
              <a
                className={styles.HeaderButton}
                onClick={() => router.push("/login")}
              >
                Login
              </a>
              <a
                className={styles.HeaderButton}
                onClick={() => router.push("/sign-in")}
              >
                Criar uma conta
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
