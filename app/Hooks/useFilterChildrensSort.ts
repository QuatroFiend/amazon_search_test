import { useState } from "react";

type SortType = "count-asc" | "count-desc" | "name-asc" | "name-desc";

interface SortableItem {
  id: number;
  name: string;
}

export const useFilterChildrensSort = () => {
  const [sortType, setSortType] = useState<SortType>("count-desc");
  console.log("sortType", sortType);
  const toggleCountSort = () => {
    setSortType((prev) => (prev === "count-desc" ? "count-asc" : "count-desc"));
  };

  const toggleNameSort = () => {
    setSortType((prev) => (prev === "name-asc" ? "name-desc" : "name-asc"));
  };
  const sortFilterItems = <T extends SortableItem>(
    items: T[],
    facetCounts: Record<number, number>,
  ): T[] => {
    return [...items].sort((a, b) => {
      if (sortType === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortType === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      const countA = facetCounts[a.id] || 0;
      const countB = facetCounts[b.id] || 0;

      if (sortType === "count-desc") {
        return countB - countA;
      }

      if (sortType === "count-asc") {
        return countA - countB;
      }

      return 0;
    });
  };

  return {
    sortType,
    toggleCountSort,
    toggleNameSort,
    isSortByCountAsc: sortType === "count-asc",
    isSortByNameAsc: sortType === "name-asc",
    sortFilterItems,
  };
};
