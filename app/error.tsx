"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./error.module.css";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.text}>
          We could not load products right now. Please try again in a moment.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.btnPrimary} onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className={styles.btnSecondary}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
