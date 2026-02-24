import { supabase } from "../../supabase/supabase";
import { ProductFilters } from "../types";
import { getErrorMessage } from "../helpers/getErrorMessage";

type ProductIdRow = {
  id: number;
};

type ProductCategoryRow = {
  category_id: number;
};

export const buildCategoryFacetCounts = async (
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
