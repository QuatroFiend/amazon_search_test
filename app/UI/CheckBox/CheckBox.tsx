import { useMemo } from "react";
import Typography from "../Typography/Typography";
import Icon from "../Icon/Icon";
import styles from "./check_box.module.css";

type CheckboxFilterProps = {
  name: string;
  onChange: (name: string, value: string | string[]) => void;
  initialOption: string[];
  options: Array<{ label: string; value: string }>;
};

const CheckboxFilter = ({
  name,
  onChange,
  initialOption,
  options,
}: CheckboxFilterProps) => {
  const normalizedInitialOption = useMemo(
    () => (initialOption ?? []).map((option) => option.toLowerCase()),
    [initialOption],
  );

  const handleCheckboxChange = (value: string) => {
    const normalizedValue = value.toLowerCase();
    const newValue = normalizedInitialOption.includes(normalizedValue)
      ? normalizedInitialOption.filter((option) => option !== normalizedValue)
      : [...normalizedInitialOption, normalizedValue];

    onChange(name, newValue);
  };

  return (
    <div className={styles.wrapper}>
      {options?.map((option) => {
        const normalizedValue = option.value.toLowerCase();
        const isChecked = normalizedInitialOption.includes(normalizedValue);

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
