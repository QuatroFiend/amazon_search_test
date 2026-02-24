import Link from "next/link";
import typography from "./typography.module.css";

interface TypographyProps {
  children: React.ReactNode;
  variant?: "title" | "cardTitle" | "error" | "info" | "link";
  className?: string;
  href?: string;
}

const Typography = ({
  children,
  variant = "title",
  className = "",
  href = "#",
}: TypographyProps) => {
  const baseClass = typography.base || "";
  const variantClass = typography[variant] || "";
  const textClassName = `${baseClass} ${variantClass} ${className}`.trim();

  if (variant === "link" && href) {
    return (
      <Link href={href} className={textClassName}>
        {children}
      </Link>
    );
  }

  return <p className={textClassName}>{children}</p>;
};

export default Typography;
