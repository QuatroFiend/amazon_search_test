"use client";
import { FilterAccordion } from "@/app/UI/FilterAccordion/FilterAccordion";
import styles from "./filter_bar.module.css";
import CheckboxFilter from "@/app/UI/CheckBox/CheckBox";
import { IBrand } from "@/app/api/brands/IBrandTypes";
import {
  ICategory,
  IProductCategory,
} from "@/app/api/categories/ICategoriesTypes";
import { useState } from "react";
import RadioButtonFilter from "@/app/UI/RadioButton/RadioButton";

type FilterConfig<Entity> = {
  title: string;
  field: keyof Entity;
  getLabel?: (item: Entity) => string;
  getValue?: (item: Entity) => string;
  items: Entity[] | null | undefined;
};

interface FilterBarProps {
  brands: IBrand[] | null;
  categories: ICategory[] | null;
  productCategories: IProductCategory[] | null;
}
export const FilterBar = ({
  brands,
  categories,
  productCategories,
}: FilterBarProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  type FilterEntity = IBrand | ICategory;

  const filters: FilterConfig<FilterEntity>[] = [
    {
      title: "Brands",
      field: "name",
      items: brands,
    },
    {
      title: "Categories",
      field: "name",
      items: categories,
    },
  ];

  return (
    <div className={styles.filterBarWrapper}>
      {filters.map((filter) => {
        if (!filter.items?.length) return null;

        const options = filter.items.map((item) => {
          const value = String(item[filter.field]);
          const label =
            filter.getLabel?.(item) ?? String(item[filter.field] ?? "—");

          return { label, value };
        });

        const isOpen = openSections.has(filter.title);

        return (
          <FilterAccordion
            key={filter.title}
            title={filter.title}
            isOpen={isOpen}
            onToggle={() => toggleSection(filter.title)}
          >
            <CheckboxFilter
              name={filter.title.toLowerCase().replace(/\s+/g, "-")}
              onChange={() => {}}
              initialOption={[]}
              options={options}
            />
          </FilterAccordion>
        );
      })}
      <RadioButtonFilter
        initialOption={"7"}
        name="Published Period"
        onChange={() => {}}
        options={[
          { label: "New (up to 7 days)", value: "7" },
          { label: "Up to 14 days", value: "14" },
          { label: "Up to 30 days", value: "30" },
          { label: "Up to 90 days", value: "90" },
        ]}
      />
    </div>
  );
};

export default FilterBar;
