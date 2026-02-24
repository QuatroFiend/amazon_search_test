export const applyFilters = <T extends { in: (column: string, values: number[]) => T }>(
  query: T,
  filters: { brandIds?: number[]; productIds?: number[] | null }
): T => {
  let result = query;

  if (filters.brandIds && filters.brandIds.length > 0) {
    result = result.in("brand_id", filters.brandIds);
  }

  if (filters.productIds && filters.productIds.length > 0) {
    result = result.in("id", filters.productIds);
  }

  return result;
};