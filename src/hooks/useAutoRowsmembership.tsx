import { useEffect, useRef, useState } from "react";

const HEADER_HEIGHT = 46;
const FIXED_ROW_HEIGHT = 76; 

export function useAutoRowsmembership() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let raf: number;

    const observer = new ResizeObserver(entries => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const height = entries[0].contentRect.height;

        const available = height - HEADER_HEIGHT;

        const rows = Math.max(
          1,
          Math.floor(available / FIXED_ROW_HEIGHT)
        );

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
