import { supabase } from "../supabase/supabase";
import { PaginationParams } from "../types/pagination";
import { IProduct } from "./IProductTypes";
import { FacetCounts, ProductFilters } from "./types";

type ProductsResult = {
  data: IProduct[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  facetCounts: FacetCounts;
};

type ProductCategoryRow = {
  product_id: number;
  category_id: number;
};

type ProductIdRow = {
  id: number;
};

type ProductBrandRow = {
  brand_id: number | null;
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: string }).message;
    return message || "Unknown error";
  }

  return "Unknown error";
};

const getProductIdsByCategory = async (categoryIds: number[]): Promise<number[]> => {
  const { data, error } = await supabase
    .from("product_categories")
    .select("product_id")
    .in("category_id", categoryIds);

  if (error) {
    console.error("Error fetching product categories:", error);
    throw new Error(
      `Failed to fetch product categories: ${getErrorMessage(error)}`,
    );
  }

  return (data as ProductCategoryRow[] | null)?.map((row) => row.product_id) || [];
};

const buildBrandFacetCounts = async (
  filters?: ProductFilters,
): Promise<Record<number, number>> => {
  let productIdsByCategory: number[] | null = null;

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    productIdsByCategory = await getProductIdsByCategory(filters.categoryIds);

    if (productIdsByCategory.length === 0) {
      return {};
    }
  }

  let brandQuery = supabase.from("products").select("brand_id");

  if (productIdsByCategory && productIdsByCategory.length > 0) {
    brandQuery = brandQuery.in("id", productIdsByCategory);
  }

  const { data, error } = await brandQuery;

  if (error) {
    console.error("Error fetching brand facet counts:", error);
    throw new Error(
      `Failed to fetch brand facet counts: ${getErrorMessage(error)}`,
    );
  }

  return ((data as ProductBrandRow[] | null) || []).reduce(
    (accumulator, row) => {
      if (typeof row.brand_id === "number") {
        accumulator[row.brand_id] = (accumulator[row.brand_id] || 0) + 1;
      }

      return accumulator;
    },
    {} as Record<number, number>,
  );
};

const buildCategoryFacetCounts = async (
  filters?: ProductFilters,
): Promise<Record<number, number>> => {
  let productIdsByBrandFilter: number[] | null = null;

  if (filters?.brandIds && filters.brandIds.length > 0) {
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id")
      .in("brand_id", filters.brandIds);

    if (productsError) {
      console.error("Error fetching products for category facets:", productsError);
      throw new Error(
        `Failed to fetch products for category facets: ${getErrorMessage(productsError)}`,
      );
    }

    productIdsByBrandFilter =
      ((productsData as ProductIdRow[] | null) || []).map((product) => product.id);

    if (productIdsByBrandFilter.length === 0) {
      return {};
    }
  }

  let categoryQuery = supabase.from("product_categories").select("category_id");

  if (productIdsByBrandFilter && productIdsByBrandFilter.length > 0) {
    categoryQuery = categoryQuery.in("product_id", productIdsByBrandFilter);
  }

  const { data, error } = await categoryQuery;

  if (error) {
    console.error("Error fetching category facet counts:", error);
    throw new Error(
      `Failed to fetch category facet counts: ${getErrorMessage(error)}`,
    );
  }

  return ((data as ProductCategoryRow[] | null) || []).reduce(
    (accumulator, row) => {
      if (typeof row.category_id === "number") {
        accumulator[row.category_id] = (accumulator[row.category_id] || 0) + 1;
      }

      return accumulator;
    },
    {} as Record<number, number>,
  );
};

const buildFacetCounts = async (filters?: ProductFilters): Promise<FacetCounts> => {
  const [brands, categories] = await Promise.all([
    buildBrandFacetCounts(filters),
    buildCategoryFacetCounts(filters),
  ]);

  return {
    brands,
    categories,
  };
};

export const getProducts = async (
  pagination: PaginationParams,
  filters?: ProductFilters,
): Promise<ProductsResult> => {
  const { page, pageSize } = pagination;
  const requestedPage =
    Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  const facetCountsPromise = buildFacetCounts(filters);

  let productIdsByCategory: number[] | null = null;

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    productIdsByCategory = await getProductIdsByCategory(filters.categoryIds);

    if (productIdsByCategory.length === 0) {
      const facetCounts = await facetCountsPromise;

      return {
        data: [],
        total: 0,
        page: 1,
        pageSize,
        pageCount: 0,
        facetCounts,
      };
    }
  }

  let countQuery = supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  if (filters?.brandIds && filters.brandIds.length > 0) {
    countQuery = countQuery.in("brand_id", filters.brandIds);
  }

  if (productIdsByCategory && productIdsByCategory.length > 0) {
    countQuery = countQuery.in("id", productIdsByCategory);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error("Error fetching products count:", countError);
    throw new Error(`Failed to fetch products count: ${countError.message}`);
  }

  const total = count || 0;
  const pageCount = Math.ceil(total / pageSize);
  const safePage = pageCount > 0 ? Math.min(requestedPage, pageCount) : 1;

  if (total === 0) {
    const facetCounts = await facetCountsPromise;

    return {
      data: [],
      total,
      page: safePage,
      pageSize,
      pageCount,
      facetCounts,
    };
  }

  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let dataQuery = supabase.from("products").select("*");

  if (filters?.brandIds && filters.brandIds.length > 0) {
    dataQuery = dataQuery.in("brand_id", filters.brandIds);
  }

  if (productIdsByCategory && productIdsByCategory.length > 0) {
    dataQuery = dataQuery.in("id", productIdsByCategory);
  }

  if (filters?.sortBy === "popular") {
    const { data: allData, error: allError } = await dataQuery;

    if (allError) {
      console.error("Error fetching products:", allError);
      throw new Error(`Failed to fetch products: ${allError.message}`);
    }

    if (!allData || allData.length === 0) {
      const facetCounts = await facetCountsPromise;

      return {
        data: [],
        total,
        page: safePage,
        pageSize,
        pageCount,
        facetCounts,
      };
    }

    const products = allData as IProduct[];
    const brandMap = products.reduce(
      (accumulator, item) => {
        if (item.brand_id) {
          accumulator[item.brand_id] = (accumulator[item.brand_id] || 0) + 1;
        }

        return accumulator;
      },
      {} as Record<number, number>,
    );

    const sortedData = [...products].sort((left, right) => {
      const countA = brandMap[left.brand_id] || 0;
      const countB = brandMap[right.brand_id] || 0;

      if (countA !== countB) {
        return countB - countA;
      }

      return (
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
      );
    });

    const paginatedData = sortedData.slice(from, to + 1);
    const facetCounts = await facetCountsPromise;

    return {
      data: paginatedData,
      total,
      page: safePage,
      pageSize,
      pageCount,
      facetCounts,
    };
  }

  switch (filters?.sortBy) {
    case "oldest":
      dataQuery = dataQuery.order("created_at", { ascending: true });
      break;
    case "name-asc":
      dataQuery = dataQuery.order("name", { ascending: true });
      break;
    case "name-desc":
      dataQuery = dataQuery.order("name", { ascending: false });
      break;
    case "newest":
    default:
      dataQuery = dataQuery.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await dataQuery.range(from, to);

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  const facetCounts = await facetCountsPromise;

  return {
    data: (data || []) as IProduct[],
    total,
    page: safePage,
    pageSize,
    pageCount,
    facetCounts,
  };
};
