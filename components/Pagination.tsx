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
  return (
    <div className="flex items-center gap-1">
      {currentPage > 1 && (
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
          (page >= currentPage - 2 && page <= currentPage + 2)
        ) {
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`${baseUrl}?page=${page}`}>{page}</Link>
            </Button>
          );
        }
        // Show ellipsis for gaps
        if (page === currentPage - 3 || page === currentPage + 3) {
          return <span key={page}>...</span>;
        }
        return null;
      })}

      {currentPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${baseUrl}?page=${currentPage + 1}`}>Next</Link>
        </Button>
      )}
    </div>
  );
}
