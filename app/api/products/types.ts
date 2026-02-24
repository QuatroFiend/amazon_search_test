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

export type FacetCounts = {
  brands: Record<number, number>;
  categories: Record<number, number>;
};
