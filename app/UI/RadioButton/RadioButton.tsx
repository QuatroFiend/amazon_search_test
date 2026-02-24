"use client";

import { useState, useEffect } from "react";
import Typography from "../Typography/Typography";
import styles from "./radio_button.module.css";

type RadioButtonFilterProps = {
  name: string;
  onChange: (name: string, value: string) => void;
  initialOption: string;
  options: Array<{ label: string; value: string }>;
};

export default function RadioButtonFilter({
  name,
  onChange,
  initialOption,
  options,
}: RadioButtonFilterProps) {
  const normalizedInitial = initialOption ?? "";

  const [selectedOption, setSelectedOption] = useState(normalizedInitial);

  useEffect(() => {
    setSelectedOption(normalizedInitial);
  }, [normalizedInitial]);

  return (
    <div className={styles.container}>
      {options.map((option) => {
        const isSelected =
          selectedOption === option.value ||
          selectedOption === option.value?.toLowerCase();

        return (
          <label key={option.value} className={styles.optionLabel}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onClick={(event) => {
                if (isSelected) {
                  event.preventDefault();
                  setSelectedOption("");
                  onChange(name, "");
                }
              }}
              onChange={() => {
                if (isSelected) return;
                setSelectedOption(option.value);
                onChange(name, option.value);
              }}
              className={styles.input}
            />

            <span
              className={`${styles.radioCircle} ${
                isSelected ? styles.radioCircleSelected : ""
              }`}
            />

            <Typography
              variant="info"
              className={`${styles.labelText} ${
                isSelected ? styles.labelTextSelected : ""
              }`}
            >
              {option.label}
            </Typography>
          </label>
        );
      })}
    </div>
  );
}
