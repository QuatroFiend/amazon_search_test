import Link from "next/link";
import typography from "./typography.module.css";

interface TypographyProps {
  content: string;
  variant?: "title" | "cardTitle" | "error" | "info" | "link";
  className?: string;
  href?: string;
}

const Typography = ({
  content,
  variant = "title",
  className = "",
  href = "#",
}: TypographyProps) => {
  const variantClass = typography[variant] || "";
  return (
    <div>
      {variant === "link" && href ? (
        <Link href={href}>
          <p className={`${variantClass} ${className}`}>{content}</p>
        </Link>
      ) : (
        <p className={`${variantClass} ${className}`}>{content}</p>
      )}
    </div>
  );
};

export default Typography;