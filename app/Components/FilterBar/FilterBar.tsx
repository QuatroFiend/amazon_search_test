"use client";

import { useState } from "react";
import { FilterAccordion } from "@/app/UI/FilterAccordion/FilterAccordion";
import CheckboxFilter from "@/app/UI/CheckBox/CheckBox";
import RadioButtonFilter from "@/app/UI/RadioButton/RadioButton";
import { Button } from "@/app/UI/Button/Button";
import { useFilters } from "@/app/Hooks/useFilters";
import { IBrand } from "@/app/api/brands/IBrandTypes";
import { ICategory } from "@/app/api/categories/ICategoriesTypes";
import { FacetCounts } from "@/app/api/products/types";
import styles from "./filter_bar.module.css";

type FilterKey = "brands" | "categories";

type FilterEntity = (IBrand | ICategory) & { id: number; name: string };

type FilterConfig<Entity> = {
  key: FilterKey;
  title: string;
  field: keyof Entity;
  items: Entity[] | null | undefined;
};

interface FilterBarProps {
  brands: IBrand[] | null;
  categories: ICategory[] | null;
  facetCounts: FacetCounts;
}

export const FilterBar = ({ brands, categories, facetCounts }: FilterBarProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const { filters: urlFilters, updateFilters, clearFilters } = useFilters();

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const filters: FilterConfig<FilterEntity>[] = [
    {
      key: "brands",
      title: "Brands",
      field: "name",
      items: brands,
    },
    {
      key: "categories",
      title: "Categories",
      field: "name",
      items: categories,
    },
  ];

  const hasActiveFilters =
    urlFilters.brands.length > 0 ||
    urlFilters.categories.length > 0 ||
    urlFilters.sortBy !== "newest";

  return (
    <div className={styles.filterBarWrapper}>
      {filters.map((filter) => {
        if (!filter.items?.length) return null;

        const options = filter.items.map((item) => {
          const value = String(item[filter.field]);
          const count = facetCounts[filter.key][item.id] || 0;
          const label = `${value} (${count})`;

          return { label, value };
        });

        const isOpen = openSections.has(filter.title);
        const filterKey = filter.key;
        const initialValues = urlFilters[filterKey] || [];

        return (
          <FilterAccordion
            key={filter.title}
            title={filter.title}
            isOpen={isOpen}
            onToggle={() => toggleSection(filter.title)}
          >
            <CheckboxFilter
              name={filter.title.toLowerCase().replace(/\s+/g, "-")}
              onChange={(name, values) => {
                updateFilters(filterKey, values as string[]);
              }}
              initialOption={initialValues}
              options={options}
            />
          </FilterAccordion>
        );
      })}
      <RadioButtonFilter
        initialOption={urlFilters.sortBy}
        name="Sort by"
        onChange={(name, value) => {
          updateFilters("sortBy", value as string);
        }}
        options={[
          { label: "Newest first", value: "newest" },
          { label: "Oldest first", value: "oldest" },
          { label: "Name (A-Z)", value: "name-asc" },
          { label: "Name (Z-A)", value: "name-desc" },
          { label: "Popular brands", value: "popular" },
        ]}
      />
      <div className={styles.clearAllFilters}>
        <Button
          buttonName="Clear all filters"
          disabled={!hasActiveFilters}
          type="submit"
          onClick={clearFilters}
        />
      </div>
    </div>
  );
};

export default FilterBar;
