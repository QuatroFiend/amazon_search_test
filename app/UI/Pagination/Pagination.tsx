"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "../Icon/Icon";
import styles from "./pagination.module.css";
import useGeneratePageRange from "@/app/Hooks/useGeneratePageRange";


export interface IPagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

interface Props {
  pagination: IPagination;
  paginationPage: number;
}

const Pagination = ({ pagination, paginationPage }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageRange = useGeneratePageRange(pagination.pageCount, paginationPage);

  const buildHref = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  if (pagination.pageCount <= 1) {
    return null;
  }

  return (
    <div className={styles.paginationWrapper}>
      {paginationPage === 1 ? (
        <span className={styles.navButtonDisabled}>
          <Icon name={"ArrowLeft"} /> Prev
        </span>
      ) : (
        <Link href={buildHref(paginationPage - 1)} className={styles.navButton}>
          <Icon name={"ArrowLeft"} /> Prev
        </Link>
      )}
      <div className={styles.pagesContainer}>
        {pageRange.map((page, index) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className={
                paginationPage === page
                  ? styles.pageLinkActive
                  : styles.pageLink
              }
            >
              {page}
            </Link>
          ),
        )}
      </div>
      {paginationPage === pagination.pageCount ? (
        <span className={styles.navButtonDisabled}>
          Next <Icon name={"ArrowRight"} />
        </span>
      ) : (
        <Link href={buildHref(paginationPage + 1)} className={styles.navButton}>
          Next <Icon name={"ArrowRight"} />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
