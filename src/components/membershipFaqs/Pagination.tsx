import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-3 text-sm text-muted-foreground">
      <button
        disabled={disabled || currentPage === 1}
        onClick={() => onPageChange(1)}
        className={cn(
          "text-xl transition-colors",
          currentPage === 1 || disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:text-foreground"
        )}
      >
        «
      </button>

      <button
        disabled={disabled || currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          "text-xl transition-colors",
          currentPage === 1 || disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:text-foreground"
        )}
      >
        ‹
      </button>

      <span className="text-foreground font-medium tabular-nums">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={disabled || currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          "text-xl transition-colors",
          currentPage === totalPages || disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:text-foreground"
        )}
      >
        ›
      </button>

      <button
        disabled={disabled || currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className={cn(
          "text-xl transition-colors",
          currentPage === totalPages || disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:text-foreground"
        )}
      >
        »
      </button>
    </div>
  );
}
