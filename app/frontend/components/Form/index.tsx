import { FormEvent, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./styles.module.css";
import { UserObject } from "../../types";
import { useRouter } from "next/router";
import Image from "next/image";

interface FormProps {
  buttonText: string;
  pathToCall: string;
}

export default function Form({ buttonText, pathToCall }: FormProps) {
  const [, setTokenCookies] = useCookies(["token"]);
  const [, setUserObjectCookies] = useCookies(["userObject"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (username.length < 3) {
      console.log(`okay`);
      return setError("Username must contain at least 3 characters");
    }

    if (password.length < 8) {
      return setError("The password must contain at least 8 characters");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${pathToCall}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (buttonText === "Entrar") {
        const data: UserObject = await response.json();

        if (data.message) {
          return setError(data.message);
        }

        const userObject = {
          id: data.id,
          username: data.username,
          accountId: data.accountId,
        };

        const token = data.token;

        setTokenCookies("token", token, { maxAge: 86400 });
        setUserObjectCookies("userObject", userObject, { maxAge: 86400 });

        router.push("/account");
      }

      if (buttonText === "Criar conta") {
        if (response.status === 201) {
          router.push("/login");
        }

        const data = await response.json();
        if (data.message) {
          return setError(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setUsername("");
    setPassword("");
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formContent} onSubmit={(e) => handleSubmit(e)}>
        {buttonText === "Criar conta" ? (
          <p
            data-testid="paragraph-to-call-clients"
            className={styles.formText}
          >
            Vem ser
          </p>
        ) : null}
        <Image
          src="/images/ngcash.webp"
          alt="logo da ng.cash"
          width={278}
          height={203}
        />
        <div className={styles.formInputContainer}>
          <input
            className={styles.formInput}
            type="text"
            name="username"
            value={username}
            placeholder="Nome de usuário"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            type="password"
            name="password"
            value={password}
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error.length > 0 ? (
          <p data-testid="error-paragraph" className={styles.formErrorMessage}>
            {error}
          </p>
        ) : null}

        <button
          data-testid="submit-button"
          className={styles.formSubmitButton}
          type="submit"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
