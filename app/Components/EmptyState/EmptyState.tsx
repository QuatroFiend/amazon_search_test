import Typography from "@/app/UI/Typography/Typography";
import styles from "./empty_state.module.css";

const EmptyState = () => {
  return (
    <section className={styles.emptyState}>
      <Typography className={styles.emptyStateTitle}>No products found</Typography>
      <Typography className={styles.emptyStateText}>Try changing filters or search query.</Typography>
    </section>
  );
};

export default EmptyState;
