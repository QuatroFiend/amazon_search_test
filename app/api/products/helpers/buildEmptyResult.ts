import { FacetCounts, ProductsResult } from "../types";

export const buildEmptyResult = async (
  page: number,
  pageSize: number,
  pageCount: number,
  facetCountsPromise: Promise<FacetCounts>,
): Promise<ProductsResult> => {
  const facetCounts = await facetCountsPromise;

  return {
    data: [],
    total: 0,
    page,
    pageSize,
    pageCount,
    facetCounts,
  };
};