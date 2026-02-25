import { supabase } from "../../supabase/supabase";
import { getErrorMessage } from "../helpers/getErrorMessage";

type ProductCategoryRow = {
  product_id: number;
};

export const getProductIdsByCategory = async (
  categoryIds: number[],
): Promise<number[]> => {
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

  const productIds = (data as ProductCategoryRow[] | null)?.map((row) => row.product_id) || [];

  const uniqueProductIds = [...new Set(productIds)];

  return uniqueProductIds;
};
