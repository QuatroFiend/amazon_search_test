import { supabase } from "../../supabase/supabase";
import { ProductFilters } from "../types";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { getProductIdsByCategory } from "../queries/getProductByCategoryId";

type ProductBrandRow = {
  brand_id: number | null;
};

export const buildBrandFacetCounts = async (
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
