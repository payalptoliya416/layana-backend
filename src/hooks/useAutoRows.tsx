import { useEffect, useRef, useState } from "react";

const ROW_HEIGHT = 52; // EXACT same as row height

export function useAutoRows() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      const height = entries[0].contentRect.height;

      // thead height = 52px
      const available = height - 52;

      const rows = Math.floor(available / ROW_HEIGHT);
      setRowsPerPage(rows > 0 ? rows : 1);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return { containerRef, rowsPerPage };
}
