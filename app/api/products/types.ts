export type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "popular";

export interface ProductFilters {
  brandIds?: number[];
  categoryIds?: number[];
  sortBy?: SortOption;
}
