export const calculatePagination = (
  requestedPage: number,
  pageSize: number,
  total: number
) => {
  const pageCount = Math.ceil(total / pageSize);
  const safePage = pageCount > 0 ? Math.min(requestedPage, pageCount) : 1;
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  return { pageCount, safePage, from, to };
};
