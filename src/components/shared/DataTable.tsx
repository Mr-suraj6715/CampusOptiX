import React from 'react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[11px]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={cn('px-4 py-3', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  'transition-colors',
                  onRowClick ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer' : ''
                )}
              >
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={cn('px-4 py-3.5', col.className)}>
                    {col.render
                      ? col.render(item)
                      : col.accessor
                      ? String(item[col.accessor] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
