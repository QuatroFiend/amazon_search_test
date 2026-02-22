import Image from "next/image";
import ArrowRight from "./icons/arrow-right.svg";
import ArrowLeft from "./icons/arrow-left.svg";

export type IconName = "ArrowRight" | "ArrowLeft";

interface IconProps {
  name: IconName;
  width?: number;
  height?: number;
  className?: string;
}

const icons: Record<IconName, string> = {
  ArrowRight,
  ArrowLeft,
};

const Icon = ({ name, width = 16, height = 16, className }: IconProps) => {
  return (
    <Image
      src={icons[name]}
      alt={name}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Icon;