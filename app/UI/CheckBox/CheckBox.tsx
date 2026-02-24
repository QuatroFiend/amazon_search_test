import { useMemo, useRef, useState } from "react";
import Typography from "../Typography/Typography";
import Icon from "../Icon/Icon";
import styles from "./check_box.module.css";

type CheckboxFilterProps = {
  name: string;
  onChange: (name: string, value: string | string[]) => void;
  initialOption: string[];
  options: Array<{ label: string; value: string }>;
};

const normalizeValues = (values?: string[]) =>
  Array.from(
    new Set((values ?? []).map((option) => option.trim()).filter(Boolean)),
  );

const CheckboxFilter = ({
  name,
  onChange,
  initialOption,
  options,
}: CheckboxFilterProps) => {
  const normalizedInitialOption = useMemo(
    () => normalizeValues(initialOption),
    [initialOption],
  );

  const [selectedValues, setSelectedValues] = useState<string[]>(
    normalizedInitialOption,
  );
  const selectedValuesRef = useRef<string[]>(normalizedInitialOption);

  const handleCheckboxChange = (value: string) => {
    const normalizedValue = value.trim();
    const previousValues = selectedValuesRef.current;
    const newValue = previousValues.includes(normalizedValue)
      ? previousValues.filter((option) => option !== normalizedValue)
      : [...previousValues, normalizedValue];

    selectedValuesRef.current = newValue;
    setSelectedValues(newValue);

    onChange(name, newValue);
  };

  return (
    <div className={styles.wrapper}>
      {options?.map((option) => {
        const normalizedValue = option.value.trim();
        const isChecked = selectedValues.includes(normalizedValue);

        return (
          <label key={option.value} className={styles.label}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => handleCheckboxChange(option.value)}
              className={styles.hiddenInput}
            />

            <span
              className={`${styles.checkbox} ${
                isChecked ? styles.checkboxActive : ""
              }`}
            >
              {isChecked && (
                <Icon
                  name="CheckboxChecked"
                  width={27}
                  height={27}
                  color="#ffffff"
                />
              )}
            </span>

            <Typography
              variant="info"
              className={`${styles.text} ${isChecked ? styles.textActive : ""}`}
            >
              {option.label}
            </Typography>
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxFilter;
