import { useEffect, useLayoutEffect, useRef, useState } from "react";

const HEADER_HEIGHT = 46;

export function useAutoRows() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10); // 👈 default so empty na rahe

  const calculate = () => {
    if (!containerRef.current) return;

    const height = containerRef.current.getBoundingClientRect().height;

    const rowEl = document.querySelector("[data-row]");
    if (!rowEl) return;

    const rowHeight = rowEl.getBoundingClientRect().height || 56;

    const available = height - HEADER_HEIGHT;
    const rows = Math.max(1, Math.floor(available / rowHeight));

    setRowsPerPage(rows);
  };

  // 👇 Page load par immediately calculate
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      calculate();
      setTimeout(calculate, 100); // fonts / layout stable thaya pachi
      setTimeout(calculate, 300);
    });
  }, []);

  // 👇 Resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      calculate();
    });

    observer.observe(containerRef.current);

    window.addEventListener("resize", calculate);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculate);
    };
  }, []);

  return { containerRef, rowsPerPage };
}

