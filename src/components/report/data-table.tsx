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
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/60">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  "px-3 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
                  col.align === "right" ? "text-right" : "text-left",
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
              className="border-b border-border/40 transition-colors last:border-b-0 hover:bg-muted/30"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-3 py-3 align-top text-muted-foreground",
                    col.align === "right" ? "text-right" : "text-left",
                    colIndex === 0 && "font-medium text-foreground",
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
