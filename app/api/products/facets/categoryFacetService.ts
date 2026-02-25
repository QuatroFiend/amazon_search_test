import { supabase } from "../../supabase/supabase";
import { ProductFilters } from "../types";
import { getErrorMessage } from "../helpers/getErrorMessage";

type CategoryCountRow = {
  category_id: number;
  count: number;
};

export const buildCategoryFacetCounts = async (
  filters?: ProductFilters,
): Promise<Record<number, number>> => {
  const { data, error } = await supabase.rpc("get_category_facet_counts", {
    p_brand_ids: filters?.brandIds || null,
    p_search_query: filters?.q?.trim() || null,
  });

  if (error) {
    console.error("Error fetching category facet counts:", error);
    throw new Error(
      `Failed to fetch category facet counts: ${getErrorMessage(error)}`,
    );
  }

  const result: Record<number, number> = {};

  if (Array.isArray(data)) {
    for (const row of data as CategoryCountRow[]) {
      if (
        typeof row.category_id === "number" &&
        typeof row.count === "number"
      ) {
        result[row.category_id] = row.count;
      }
    }
  }

  return result;
};
