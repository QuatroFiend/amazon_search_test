import { ReactNode } from "react";
import Typography from "../Typography/Typography";
import Icon from "../Icon/Icon";
import styles from "./filter_accordion.module.css";

interface FilterAccordionProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterAccordion = ({
  children,
  title,
  isOpen,
  onToggle,
}: FilterAccordionProps) => {
  return (
    <div className={styles.accordionWrapper}>
      <button onClick={onToggle}>
        <Typography variant="cardTitle">{title}</Typography>
        {isOpen ? <Icon name="ArrowUp" /> : <Icon name="ArrowDown" />}
      </button>
      <div
        className={[
          styles.accordionChildren,
          isOpen
            ? styles.accordionChildrenUntoggled
            : styles.accordionChildrenToggled,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
};
