import { MouseEventHandler } from "react";
import btn from "./button.module.css";

interface ButtonProps {
  buttonName: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}
export const Button = ({
  onClick,
  buttonName,
  type = "button",
  disabled,
}: ButtonProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
        className={btn.btn}
        disabled={disabled}
      >
        {buttonName}
      </button>
    </div>
  );
};