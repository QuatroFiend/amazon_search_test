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
  const variantClass = typography[variant] || "";

  if (variant === "link" && href) {
    return (
      <Link href={href} className={`${variantClass} ${className}`}>
        {children}
      </Link>
    );
  }

  return <p className={`${variantClass} ${className}`}>{children}</p>;
};

export default Typography;