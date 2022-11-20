import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.HomeContainer}>
      {/* <Header /> */}
      <main className={styles.HomeMainContent}>
        <Image
          src="/images/ngcash.webp"
          alt="logo da ng.cash"
          width="556"
          height="406"
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
