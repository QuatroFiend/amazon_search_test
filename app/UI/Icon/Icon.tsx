import ArrowRight from "./icons/ArrowRight";
import ArrowLeft from "./icons/ArrowLeft";
import ArrowDown from "./icons/ArrowDown";
import ArrowUp from "./icons/ArrowUp";
import Search from "./icons/Search";
import Menu from "./icons/Menu";
import CheckboxChecked from "./icons/CheckboxChecked";
import CheckboxUnchecked from "./icons/CheckboxUnchecked";
import Clear from "./icons/Clear";
import Sort from "./icons/Sort";
import SecondSort from "./icons/SecondSort";
import { JSX, SVGProps } from "react";

export type IconName =
  | "ArrowRight"
  | "ArrowLeft"
  | "Search"
  | "Menu"
  | "ArrowDown"
  | "ArrowUp"
  | "CheckboxChecked"
  | "CheckboxUnchecked"
  | "Clear"
  | "Sort"
  | "SecondSort"
  ;

interface IconProps {
  name: IconName;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const icons = {
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Search,
  Menu,
  CheckboxChecked,
  CheckboxUnchecked,
  Clear,
  Sort,
  SecondSort
} satisfies Record<IconName, (props: SVGProps<SVGSVGElement>) => JSX.Element>;

export default function Icon({
  name,
  width = 16,
  height = 16,
  color,
  className,
}: IconProps) {
  const SvgIcon = icons[name];

  return (
    <SvgIcon
      width={width}
      height={height}
      className={className}
      style={color ? { color } : undefined}
    />
  );
}
