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

  const parseIdListParam = useCallback(
    (paramName: "brands" | "categories"): string[] => {
      const rawParam = searchParams.get(paramName);
      if (!rawParam) return [];

      const parsedIds = rawParam
        .split(",")
        .map((value) => value.trim())
        .filter((value) => /^\d+$/.test(value));

      return Array.from(new Set(parsedIds));
    },
    [searchParams],
  );

  const getFilterValues = useCallback((): FilterValues => {
    return {
      brands: parseIdListParam("brands"),
      categories: parseIdListParam("categories"),
      sortBy: searchParams.get("sortBy") || "newest",
    };
  }, [searchParams, parseIdListParam]);

  const updateFilters = useCallback(
    (filterName: keyof FilterValues, value: string | string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (Array.isArray(value)) {
        const normalizedValues = Array.from(
          new Set(
            value
              .map((item) => item.trim())
              .filter((item) => /^\d+$/.test(item)),
          ),
        );

        if (normalizedValues.length > 0) {
          params.set(filterName, normalizedValues.join(","));
        } else {
          params.delete(filterName);
        }
      } else {
        if (value) {
          params.set(filterName, value);
        } else {
          params.delete(filterName);
        }
      }

      params.delete("page");
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brands");
    params.delete("categories");
    params.delete("sortBy");
    params.delete("page");

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return {
    filters: getFilterValues(),
    updateFilters,
    clearFilters,
  };
}
