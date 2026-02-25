import { supabase } from "../../supabase/supabase";
import { ProductFilters } from "../types";
import { getErrorMessage } from "../helpers/getErrorMessage";

type BrandCountRow = {
  brand_id: number;
  count: number;
};

export const buildBrandFacetCounts = async (
  filters?: ProductFilters,
): Promise<Record<number, number>> => {
  const { data, error } = await supabase.rpc("get_brand_facet_counts", {
    p_category_ids: filters?.categoryIds || null,
    p_search_query: filters?.q?.trim() || null,
  });

  if (error) {
    console.error("Error fetching brand facet counts:", error);
    throw new Error(
      `Failed to fetch brand facet counts: ${getErrorMessage(error)}`,
    );
  }

  const result: Record<number, number> = {};

  if (Array.isArray(data)) {
    for (const row of data as BrandCountRow[]) {
      if (typeof row.brand_id === "number" && typeof row.count === "number") {
        result[row.brand_id] = row.count;
      }
    }
  }

  return result;
};
