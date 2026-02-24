export const applyFilters = <
  T extends {
    in: (column: string, values: number[]) => T;
    ilike: (column: string, pattern: string) => T;
  },
>(
  query: T,
  filters: { brandIds?: number[]; productIds?: number[] | null; q?: string },
): T => {
  let result = query;

  if (filters.brandIds && filters.brandIds.length > 0) {
    result = result.in("brand_id", filters.brandIds);
  }

  if (filters.productIds && filters.productIds.length > 0) {
    result = result.in("id", filters.productIds);
  }

  if (filters.q?.trim()) {
    result = result.ilike("name", `%${filters.q.trim()}%`);
  }

  return result;
};
