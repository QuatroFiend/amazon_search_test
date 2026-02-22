import { supabase } from "../supabase/supabase";
import { PaginationParams } from "../types/Pagination";

export const getProducts = async (
  pagination: PaginationParams,
  filters?: string,
) => {
  const { page, pageSize } = pagination;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const query = supabase.from("products").select("*", { count: "exact" });
  // if (filters?.brandId) query = query.eq("brand_id", filters.brandId);
  // if (filters?.search) query = query.ilike("name", `%${filters.search}%`);

  // const { data } = await supabase.from("products").select("*");
  const { data, count } = await query.range(from, to);
  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    pageCount: Math.ceil((count || 0) / pageSize),
  };
};
