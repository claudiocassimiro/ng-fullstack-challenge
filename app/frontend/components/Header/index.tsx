import Image from "next/image";
import { useRouter } from "next/router";
import { useWindowSize } from "../../utils/helpers";
import styles from "./styles.module.css";

export default function Header() {
  const { isDesktop } = useWindowSize();
  const router = useRouter();
  return (
    <header className={styles.header}>
      <Image
        src="/images/logo-ngcash.svg"
        alt="logo ngcash"
        width={isDesktop ? 160 : 120}
        height={isDesktop ? 48 : 38}
      />
      <div className={styles.HeaderContainerButtons}>
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
    </header>
  );
}
