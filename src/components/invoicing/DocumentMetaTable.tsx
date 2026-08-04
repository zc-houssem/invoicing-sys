import React from 'react';
import { cn } from '@/lib/utils';

export interface MetaTableRow {
  label: string;
  value: React.ReactNode;
}

export interface DocumentMetaTableProps {
  rows: MetaTableRow[];
  className?: string;
}

export const DocumentMetaTable = ({ rows, className }: DocumentMetaTableProps) => {
  return (
    <div className={cn('w-full overflow-hidden rounded-lg border', className)}>
      <table className="w-full">
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.label}-${index}`} className="border-b last:border-b-0">
              <td className="w-[42%] bg-muted/40 px-3 py-2.5 align-top text-xs font-medium text-muted-foreground">
                {row.label}
              </td>
              <td className="px-3 py-2.5 text-xs text-foreground [&_*]:text-xs">{row.value ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
