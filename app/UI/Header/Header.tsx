import SearchBar from "@/app/Components/SearchBar/SearchBar";
import styles from "./header.module.css";

interface HeaderProps {
  logo?: string;
}

const Header = ({ logo = "My Lil' Amazon" }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>{logo}</div>
      <div className={styles.searchArea}>
        <SearchBar />
      </div>
      <div className={styles.rightSection}></div>
    </header>
  );
};

export default Header;
