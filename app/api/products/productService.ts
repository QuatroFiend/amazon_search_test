import { supabase } from "../supabase/supabase";
import { PaginationParams } from "../types/pagination";
import { IProduct, ProductFilters, ProductsResult } from "./types";
import { buildFacetCounts } from "./facets/buildFacetCounts";
import { sortByPopularity } from "./helpers/sortByPopularity";
import { getErrorMessage } from "./helpers/getErrorMessage";
import { buildEmptyResult } from "./helpers/buildEmptyResult";
import { getProductIdsByCategory } from "./queries/getProductByCategoryId";
import { applyFilters } from "./helpers/applyFilters";
import { calculatePagination } from "./helpers/calculatePagination";
import { applySorting } from "./helpers/applySorting";

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
      return buildEmptyResult(1, pageSize, 0, facetCountsPromise);
    }
  }

  let countQuery = supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  countQuery = applyFilters(countQuery, {
    brandIds: filters?.brandIds,
    productIds: productIdsByCategory,
  });

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error("Error fetching products count:", countError);
    throw new Error(
      `Failed to fetch products count: ${getErrorMessage(countError)}`,
    );
  }

  const total = count || 0;
  const { pageCount, safePage, from, to } = calculatePagination(
    requestedPage,
    pageSize,
    total,
  );

  if (total === 0) {
    return buildEmptyResult(safePage, pageSize, pageCount, facetCountsPromise);
  }

  let dataQuery = supabase.from("products").select("*");

  dataQuery = applyFilters(dataQuery, {
    brandIds: filters?.brandIds,
    productIds: productIdsByCategory,
  });

  if (filters?.sortBy === "popular") {
    const { data: allData, error: allError } = await dataQuery;

    if (allError) {
      console.error("Error fetching products:", allError);
      throw new Error(`Failed to fetch products: ${getErrorMessage(allError)}`);
    }

    const sortedData = sortByPopularity((allData || []) as IProduct[]);
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

  dataQuery = applySorting(dataQuery, filters?.sortBy);

  const { data, error } = await dataQuery.range(from, to);

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Failed to fetch products: ${getErrorMessage(error)}`);
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
