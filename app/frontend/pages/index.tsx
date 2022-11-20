import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useWindowSize } from "../utils/helpers";

export default function Home() {
  const { isDesktop } = useWindowSize();
  return (
    <div className={styles.HomeContainer}>
      {/* <Header /> */}
      <main className={styles.HomeMainContent}>
        <Image
          src="/images/ngcash.webp"
          alt="logo da ng.cash"
          width={isDesktop ? 556 : 278}
          height={isDesktop ? 406 : 203}
        />
        <div className={styles.HomeContainerText}>
          <p className={styles.HomeAboutUsText}>
            Somos a carteira digital da Nova Geração.
          </p>
        </div>
      </main>
    </div>
  );
}
