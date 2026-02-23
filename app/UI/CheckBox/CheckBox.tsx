
import { useState } from "react"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import styles from "./check_box.module.css"

type CheckboxFilterProps = {
  name: string
  onChange: (name: string, value: string|string[]) => void
  initialOption: string[]
  options: Array<{ label: string; value: string }>
}

const CheckboxFilter = ({
  name,
  onChange,
  initialOption,
  options,
}: CheckboxFilterProps) => {
  const normalizedInitialOption = initialOption ?? []

  const [prevInitial, setPrevInitial] = useState(normalizedInitialOption)
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    normalizedInitialOption
  )

  if (JSON.stringify(normalizedInitialOption) !== JSON.stringify(prevInitial)) {
    setPrevInitial(normalizedInitialOption)
    setSelectedOptions(normalizedInitialOption)
  }

  const handleCheckboxChange = (value: string) => {
    const normalizedValue = value.toLowerCase()

    setSelectedOptions((prevSelected) => {
      const newValue = prevSelected.includes(normalizedValue)
        ? prevSelected.filter((option) => option !== normalizedValue)
        : [...prevSelected, normalizedValue]

      onChange(name, newValue)

      return newValue
    })
  }

  return (
    <div className={styles.wrapper}>
      {options?.map((option) => {
        const normalizedValue = option.value.toLowerCase()
        const isChecked = selectedOptions.includes(normalizedValue)

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
                  width={8}
                  height={8}
                />
              )}
            </span>

            <Typography
              variant="info"
              className={`${styles.text} ${
                isChecked ? styles.textActive : ""
              }`}
            >
              {option.label}
            </Typography>
          </label>
        )
      })}
    </div>
  )
}

export default CheckboxFilter
