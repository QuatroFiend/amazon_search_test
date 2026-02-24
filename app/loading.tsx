import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <div className={styles.loadingSpinner} />
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
}
