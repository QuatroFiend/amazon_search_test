
export type IProduct = {
    id: number;
    name: string;
    created_at: string;
    image: string;
    brand_id:number;
}

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

export type ProductsResult = {
  data: IProduct[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  facetCounts: FacetCounts;
};