import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "./Button";

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[] | undefined;
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalRecords?: number;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading,
  isError,
  errorMessage = "Erro ao carregar dados. Tente novamente mais tarde.",
  emptyMessage = "Nenhum registro encontrado.",
  skeletonRows = 5,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  totalRecords,
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function handleSort(col: ColumnDef<T>) {
    if (!col.sortable) return;
    if (sortCol === col.id) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortCol(null);
        setSortDir(null);
      }
    } else {
      setSortCol(col.id);
      setSortDir("asc");
    }
  }

  let sortedData = data;
  if (sortedData && sortCol && sortDir) {
    const col = columns.find((c) => c.id === sortCol);
    if (col?.sortFn) {
      sortedData = [...sortedData].sort((a, b) =>
        sortDir === "asc" ? col.sortFn!(a, b) : col.sortFn!(b, a),
      );
    }
  }

  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full text-sm">
          <thead className="bg-bg-canvas text-text-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`${col.align === "right" ? "text-right" : "text-left"} px-4 py-3 font-medium`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="bg-bg-card">
                {columns.map((col, j) => (
                  <td key={col.id} className="px-4 py-3">
                    <div
                      className="h-4 rounded bg-border-subtle animate-pulse"
                      style={{ width: `${40 + ((j * 20) % 40)}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-error-border bg-error-bg p-4 text-error-text text-sm">
        {errorMessage}
      </div>
    );
  }

  if (!sortedData || sortedData.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-bg-card p-10 text-center text-text-muted text-sm">
        {emptyMessage}
      </div>
    );
  }

  const hasPagination = page !== undefined && totalPages !== undefined && onPageChange;

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full text-sm">
          <thead className="bg-bg-canvas text-text-muted">
            <tr>
              {columns.map((col) => {
                const SortIcon =
                  sortCol === col.id
                    ? sortDir === "asc"
                      ? ArrowUp
                      : ArrowDown
                    : ArrowUpDown;

                return (
                  <th
                    key={col.id}
                    className={`${col.align === "right" ? "text-right" : "text-left"} px-4 py-3 font-medium ${
                      col.sortable ? "cursor-pointer select-none" : ""
                    }`}
                    onClick={() => handleSort(col)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && <SortIcon className="w-3.5 h-3.5" />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {sortedData.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`bg-bg-card hover:bg-brand-50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={`px-4 py-3 ${col.align === "right" ? "text-right" : ""}`}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasPagination && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-text-muted">
            Pagina {page} de {totalPages}
            {totalRecords !== undefined && ` (${totalRecords} registros)`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Proximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
