import { useMediaQuery } from "react-responsive";

const useGeneratePageRange = (pageCount: number, paginationPage: number) => {
  const isMobile = useMediaQuery({ maxWidth: 439 });
  const xs = useMediaQuery({ maxWidth: 380 });
  const isTablet = useMediaQuery({ minWidth: 511, maxWidth: 1023 });

  if (xs) {
    if (pageCount <= 2) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    if (paginationPage === 1) {
      return [1, 2];
    }
    if (paginationPage === pageCount) {
      return [pageCount - 1, pageCount];
    }
    return [paginationPage, paginationPage + 1];
  }

  if (isMobile) {
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    if (paginationPage <= 2) {
      return [1, 2];
    }
    if (paginationPage >= pageCount - 1) {
      return [pageCount - 1, pageCount];
    }
    return [paginationPage, paginationPage + 1];
  }

  if (isTablet) {
    if (pageCount <= 4) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    if (paginationPage <= 2) {
      return [1, 2, 3, 4];
    }
    if (paginationPage >= pageCount - 2) {
      return [pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    }
    return [
      paginationPage - 1,
      paginationPage,
      paginationPage + 1,
      paginationPage + 2,
    ];
  }

  const maxVisible = 6;
  if (pageCount <= maxVisible) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  let start = Math.max(2, paginationPage - Math.floor((maxVisible - 2) / 2));
  let end = Math.min(
    pageCount - 1,
    paginationPage + Math.floor((maxVisible - 2) / 2),
  );

  if (paginationPage <= Math.ceil(maxVisible / 2)) {
    start = 2;
    end = maxVisible - 1;
  } else if (paginationPage >= pageCount - Math.ceil(maxVisible / 2)) {
    start = pageCount - (maxVisible - 2);
    end = pageCount - 1;
  }

  const pages: (number | string)[] = [1];

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < pageCount - 1) pages.push("...");
  pages.push(pageCount);

  return pages;
};

export default useGeneratePageRange;
