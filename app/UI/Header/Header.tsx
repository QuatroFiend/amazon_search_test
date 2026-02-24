"use client";

import { FocusEvent, Suspense, useState } from "react";
import SearchBar from "@/app/Components/SearchBar/SearchBar";
import styles from "./header.module.css";
import Typography from "../Typography/Typography";

interface HeaderProps {
  logo?: string;
}

const Header = ({ logo = "My Lil' Amazon" }: HeaderProps) => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleSearchBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsSearchActive(false);
    }
  };

  const handleOverlayMouseDown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsSearchActive(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Typography href="/" variant="link">{logo}</Typography>
        </div>
        <div
          className={styles.searchArea}
          onFocusCapture={handleSearchFocus}
          onBlurCapture={handleSearchBlur}
        >
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
        <div className={styles.rightSection}></div>
      </header>
      <div
        className={`${styles.searchOverlay} ${
          isSearchActive ? styles.searchOverlayActive : ""
        }`}
        aria-hidden="true"
        onMouseDown={handleOverlayMouseDown}
      />
    </>
  );
};

export default Header;
