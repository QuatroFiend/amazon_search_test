"use client";

import { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconButton from "@/app/UI/IconButton/IconButton";
import Input from "@/app/UI/Input/Input";
import styles from "./search_bar.module.css";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentQuery = searchParams.get("q") || "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const formData = new FormData(event.currentTarget);
    const normalizedQuery = String(formData.get("q") || "").trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.push(nextUrl, { scroll: false });
  };

  return (
    <form className={styles.searchBarWrapper} onSubmit={handleSubmit}>
      <IconButton
        iconHeight={24}
        iconWidth={24}
        iconName="Menu"
        textContent="All"
        className={styles.allButton}
        type="button"
      />
      <Input
        type="text"
        name="q"
        placeholder="Search My Lil' Amazon"
        className={styles.searchInput}
        defaultValue={currentQuery}
        key={currentQuery}
      />
      <IconButton
        iconHeight={24}
        iconWidth={24}
        iconName="Search"
        className={styles.searchButton}
        type="submit"
        aria-label="Search products"
      />
    </form>
  );
};

export default SearchBar;
