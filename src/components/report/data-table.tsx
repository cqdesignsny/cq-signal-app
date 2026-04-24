import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  width?: string;
  render: (row: T, index: number) => ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyState?: ReactNode;
};

export function DataTable<T>({ columns, rows, emptyState }: Props<T>) {
  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="mt-4 w-full border-collapse text-[14px]">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  "bg-neutral-900 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white dark:bg-neutral-800",
                  col.align === "right" ? "text-right" : "text-left",
                  i === 0 && "rounded-tl-md",
                  i === columns.length - 1 && "rounded-tr-md",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/40 last:border-b-0 even:bg-muted/30"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-3.5 py-2.5 text-muted-foreground",
                    col.align === "right" ? "text-right" : "text-left",
                    colIndex === 0 && "font-semibold text-foreground",
                  )}
                >
                  {col.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
