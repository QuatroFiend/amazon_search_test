import IconButton from "@/app/UI/IconButton/IconButton";
import Input from "@/app/UI/Input/Input";
import styles from "./search_bar.module.css";

const SearchBar = () => {
  return (
    <div className={styles.searchBarWrapper}>
      <IconButton
        iconHeight={24}
        iconWidth={24}
        iconName="Menu"
        textContent="All"
        className={styles.allButton}
      />
      <Input
        type="text"
        placeholder="Search My Lil' Amazon"
        className={styles.searchInput}
      />
      <IconButton
        iconHeight={24}
        iconWidth={24}
        iconName="Search"
        className={styles.searchButton}
      />
    </div>
  );
};

export default SearchBar;
