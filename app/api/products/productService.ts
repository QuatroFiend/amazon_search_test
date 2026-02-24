import { supabase } from "../supabase/supabase";
import { PaginationParams } from "../types/pagination";
import { ProductFilters } from "./types";

export const getProducts = async (
  pagination: PaginationParams,
  filters?: ProductFilters,
) => {
  const { page, pageSize } = pagination;
  const requestedPage =
    Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  let productIdsByCategory: number[] | null = null;

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    const { data: productCategories, error: categoryError } = await supabase
      .from("product_categories")
      .select("product_id")
      .in("category_id", filters.categoryIds);

    if (categoryError) {
      console.error("Error fetching product categories:", categoryError);
      throw new Error(
        `Failed to fetch product categories: ${categoryError.message}`,
      );
    }

    productIdsByCategory = productCategories?.map((pc) => pc.product_id) || [];

    if (productIdsByCategory.length === 0) {
      return { data: [], total: 0, page: 1, pageSize, pageCount: 0 };
    }
  }

  let countQuery = supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  if (filters?.brandIds && filters.brandIds.length > 0) {
    countQuery = countQuery.in("brand_id", filters.brandIds);
  }

  if (productIdsByCategory) {
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
    return { data: [], total, page: safePage, pageSize, pageCount };
  }

  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let dataQuery = supabase.from("products").select("*");

  if (filters?.brandIds && filters.brandIds.length > 0) {
    dataQuery = dataQuery.in("brand_id", filters.brandIds);
  }

  if (productIdsByCategory) {
    dataQuery = dataQuery.in("id", productIdsByCategory);
  }

  if (filters?.sortBy === "popular") {
    const { data: allData, error: allError } = await dataQuery;

    if (allError) {
      console.error("Error fetching products:", allError);
      throw new Error(`Failed to fetch products: ${allError.message}`);
    }

    if (!allData || allData.length === 0) {
      return {
        data: [],
        total,
        page: safePage,
        pageSize,
        pageCount,
      };
    }

    const brandMap = allData.reduce(
      (acc, item) => {
        if (item.brand_id) {
          acc[item.brand_id] = (acc[item.brand_id] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

    const sortedData = allData.sort((a, b) => {
      const countA = brandMap[a.brand_id] || 0;
      const countB = brandMap[b.brand_id] || 0;

      if (countA !== countB) {
        return countB - countA;
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    const paginatedData = sortedData.slice(from, to + 1);

    return {
      data: paginatedData,
      total,
      page: safePage,
      pageSize,
      pageCount,
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

  return {
    data: data || [],
    total,
    page: safePage,
    pageSize,
    pageCount,
  };
};
