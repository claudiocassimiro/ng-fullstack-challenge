import Image from "next/image";
import { useWindowSize } from "../../utils/helpers";
import styles from "./styles.module.css";

export default function Header() {
  const { isDesktop } = useWindowSize();
  return (
    <header className={styles.header}>
      <Image
        src="/images/logo-ngcash.svg"
        alt="logo ngcash"
        width={isDesktop ? 160 : 120}
        height={isDesktop ? 48 : 38}
      />
      <div className={styles.HeaderContainerButtons}>
        <a className={styles.HeaderButton} href="/login">
          Login
        </a>
        <a className={styles.HeaderButton} href="/sign-in">
          Criar uma conta
        </a>
      </div>
    </header>
  );
}
