import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Key,
  type ReactNode,
} from "react";

const GRID_GAP_PX = 16;
const POSTER_RATIO = 3 / 2;
const DEFAULT_CARD_BODY_PX = 64;
const OVERSCAN_ROWS = 8;
const FULL_ROW_CLASS = "col-span-2 sm:col-span-4 lg:col-span-6";

export type VirtualGridProps<T> = {
  items: T[];
  getKey: (item: T) => Key;
  renderItem: (item: T) => ReactNode;
  cardBodyHeight?: number;
  className?: string;
};

function getColumnCount(width: number): number {
  if (width >= 1024) return 6;
  if (width >= 640) return 4;
  return 2;
}

function getInitialViewport() {
  return { scrollY: 0, viewportHeight: 900 };
}

export function VirtualGrid<T>({
  items,
  getKey,
  renderItem,
  cardBodyHeight = DEFAULT_CARD_BODY_PX,
  className = "grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6",
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState({ width: 0, top: 0 });
  const [viewport, setViewport] = useState(getInitialViewport);

  const measureLayout = useCallback(() => {
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = {
      width: Math.round(rect.width),
      top: Math.round(rect.top + window.scrollY),
    };
    setLayout((prev) =>
      prev.width === next.width && prev.top === next.top ? prev : next,
    );
  }, []);

  useEffect(() => {
    measureLayout();
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measureLayout);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measureLayout]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const updateViewport = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setViewport({
          scrollY: window.scrollY,
          viewportHeight: window.innerHeight,
        });
        measureLayout();
      });
    };

    window.addEventListener("scroll", updateViewport, { passive: true });
    window.addEventListener("resize", updateViewport);
    updateViewport();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [measureLayout]);

  const columns = getColumnCount(layout.width);
  const columnWidth =
    layout.width > 0
      ? (layout.width - GRID_GAP_PX * (columns - 1)) / columns
      : 180;
  const rowHeight = Math.max(
    1,
    columnWidth * POSTER_RATIO + cardBodyHeight + GRID_GAP_PX,
  );

  const windowed = useMemo(() => {
    if (items.length === 0) {
      return {
        topSpacer: 0,
        bottomSpacer: 0,
        startIndex: 0,
        visibleItems: [] as T[],
      };
    }

    const totalRows = Math.ceil(items.length / columns);
    const visibleStart = Math.max(0, viewport.scrollY - layout.top);
    const visibleEnd = visibleStart + viewport.viewportHeight;
    const startRow = Math.max(
      0,
      Math.floor(visibleStart / rowHeight) - OVERSCAN_ROWS,
    );
    const endRow = Math.min(
      totalRows,
      Math.ceil(visibleEnd / rowHeight) + OVERSCAN_ROWS,
    );
    const startIndex = startRow * columns;
    const endIndex = Math.min(
      items.length,
      Math.max(startIndex, endRow * columns),
    );
    const renderedRows = Math.ceil((endIndex - startIndex) / columns);

    return {
      topSpacer: startRow * rowHeight,
      bottomSpacer: Math.max(
        0,
        (totalRows - startRow - renderedRows) * rowHeight,
      ),
      startIndex,
      visibleItems: items.slice(startIndex, endIndex),
    };
  }, [
    columns,
    items,
    layout.top,
    rowHeight,
    viewport.scrollY,
    viewport.viewportHeight,
  ]);

  return (
    <div ref={containerRef} className={className}>
      {windowed.topSpacer > 0 ? (
        <div
          className={FULL_ROW_CLASS}
          style={{ height: windowed.topSpacer }}
          aria-hidden
        />
      ) : null}
      {windowed.visibleItems.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
      {windowed.bottomSpacer > 0 ? (
        <div
          className={FULL_ROW_CLASS}
          style={{ height: windowed.bottomSpacer }}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
