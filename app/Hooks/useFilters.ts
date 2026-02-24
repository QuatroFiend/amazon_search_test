"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export type FilterValues = {
  brands: string[];
  categories: string[];
  sortBy: string;
};

export function useFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // get filter vlaues from url path
  const getFilterValues = useCallback((): FilterValues => {
    return {
      brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
      categories:
        searchParams.get("categories")?.split(",").filter(Boolean) || [],
      sortBy: searchParams.get("sortBy") || "newest",
    };
  }, [searchParams]);

  // update url with new params
  const updateFilters = useCallback(
    (filterName: keyof FilterValues, value: string | string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (Array.isArray(value)) {
        // array values like brands and categories
        if (value.length > 0) {
          params.set(filterName, value.join(","));
        } else {
          params.delete(filterName);
        }
      } else {
        // single values like sort by
        if (value) {
          params.set(filterName, value);
        } else {
          params.delete(filterName);
        }
      }

      // update without rerender
      params.delete("page");
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.push(nextUrl, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters: getFilterValues(),
    updateFilters,
    clearFilters,
  };
}
