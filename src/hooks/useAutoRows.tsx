import { useEffect, useRef, useState } from "react";

const HEADER_HEIGHT = 52;
const PAGINATION_HEIGHT = 56;

export function useAutoRows() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let raf: number;

    const observer = new ResizeObserver(entries => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const height = entries[0].contentRect.height;

        const rowHeight =
          document.querySelector("[data-row]")?.getBoundingClientRect().height || 56;

        const available =
          height - HEADER_HEIGHT - PAGINATION_HEIGHT;

        const rows = Math.max(1, Math.floor(available / rowHeight));

        setRowsPerPage(rows);
      });
    });

    observer.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return { containerRef, rowsPerPage };
}
