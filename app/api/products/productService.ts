import { supabase } from "../supabase/supabase";
import { PaginationParams } from "../types/pagination";
import { IProduct, ProductFilters, ProductsResult } from "./types";
import { buildFacetCounts } from "./facets/buildFacetCounts";
import { sortByPopularity } from "./helpers/sortByPopularity";
import { getErrorMessage } from "./helpers/getErrorMessage";
import { buildEmptyResult } from "./helpers/buildEmptyResult";
import { calculatePagination } from "./helpers/calculatePagination";

export const getProducts = async (
  pagination: PaginationParams,
  filters?: ProductFilters,
): Promise<ProductsResult> => {
  const { page, pageSize } = pagination;
  const requestedPage =
    Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  const facetCountsPromise = buildFacetCounts(filters);

  // Use RPC function to count filtered products
  const { data: countData, error: countError } = await supabase.rpc(
    'count_filtered_products',
    {
      p_category_ids: filters?.categoryIds || null,
      p_brand_ids: filters?.brandIds || null,
      p_search_query: filters?.q?.trim() || null,
    }
  );

  if (countError) {
    console.error("Error fetching products count:", countError);
    throw new Error(
      `Failed to fetch products count: ${getErrorMessage(countError)}`,
    );
  }

  const total = countData || 0;
  const { pageCount, safePage, from, to } = calculatePagination(
    requestedPage,
    pageSize,
    total,
  );

  if (total === 0) {
    return buildEmptyResult(safePage, pageSize, pageCount, facetCountsPromise);
  }

  // For 'popular' sorting, we need to fetch all products and sort in-app
  if (filters?.sortBy === "popular") {
    const { data: allData, error: allError } = await supabase.rpc(
      'get_filtered_products',
      {
        p_category_ids: filters?.categoryIds || null,
        p_brand_ids: filters?.brandIds || null,
        p_search_query: filters?.q?.trim() || null,
        p_sort_by: 'newest', // default sort for fetching before popularity sort
        p_offset: 0,
        p_limit: 100000, // Get all for sorting
      }
    );

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

  // For other sorting, use RPC function with pagination
  const { data, error } = await supabase.rpc(
    'get_filtered_products',
    {
      p_category_ids: filters?.categoryIds || null,
      p_brand_ids: filters?.brandIds || null,
      p_search_query: filters?.q?.trim() || null,
      p_sort_by: filters?.sortBy || 'newest',
      p_offset: from,
      p_limit: pageSize,
    }
  );

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
