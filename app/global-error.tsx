"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>Critical application error</h2>
            <p className={styles.text}>
              The page failed to render. Please retry or reload the application.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => reset()}
              >
                Retry render
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => window.location.assign("/")}
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
