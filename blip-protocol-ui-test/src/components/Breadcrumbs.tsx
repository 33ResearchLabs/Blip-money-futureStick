import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import StructuredData, { createBreadcrumbSchema } from "@/components/StructuredData";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  /* Build structured data items for JSON-LD.
     Every item gets a full URL; the last item uses the current page URL. */
  const schemaItems = items.map((item) => ({
    name: item.label,
    url: item.href
      ? `https://blip.money${item.href}`
      : typeof window !== "undefined"
        ? window.location.href
        : "https://blip.money",
  }));

  return (
    <>
      {/* Breadcrumb JSON-LD structured data */}
      <StructuredData
        type="custom"
        schema={createBreadcrumbSchema(schemaItems)}
      />

      {/* Visible breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-4">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index} className="inline-flex items-center gap-1.5">
              {/* Separator (before every item except the first) */}
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-black/25 dark:text-white/25 flex-shrink-0" />
              )}

              {/* Link or plain text */}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "text-black/70 dark:text-white/70 font-medium"
                      : "text-black/40 dark:text-white/40"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
