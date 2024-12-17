import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const displayPage = currentPage + 1;
  return (
    <div className="flex items-center justify-center gap-1">
      {displayPage > 1 && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${baseUrl}?page=${currentPage - 1}`}>Previous</Link>
        </Button>
      )}

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        // Show first page, last page, and 2 pages around current page
        if (
          page === 1 ||
          page === totalPages ||
          (page >= displayPage - 2 && page <= displayPage + 2)
        ) {
          return (
            <Button
              key={page}
              variant={displayPage === page ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`${baseUrl}?page=${i}`}>{page}</Link>
            </Button>
          );
        }
        // Show ellipsis for gaps
        if (page === displayPage - 3 || page === displayPage + 3) {
          return <span key={page}>...</span>;
        }
        return null;
      })}

      {displayPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${baseUrl}?page=${currentPage + 1}`}>Next</Link>
        </Button>
      )}
    </div>
  );
}
