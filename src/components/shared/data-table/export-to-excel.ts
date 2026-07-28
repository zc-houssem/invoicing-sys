import * as XLSX from 'xlsx';
import { Table } from '@tanstack/react-table';

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function formatExportValue(value: unknown): string | number | boolean {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return JSON.stringify(value);
}

export function buildExportRows<T>(table: Table<T>, rows: T[]): Record<string, unknown>[] {
  const columns = table
    .getVisibleLeafColumns()
    .filter((column) => column.id !== 'actions' && !column.columnDef.meta?.skipExport);

  return rows.map((row) => {
    const exportRow: Record<string, unknown> = {};

    for (const column of columns) {
      const meta = column.columnDef.meta;
      const label = meta?.exportLabel ?? column.id;
      let value: unknown;

      if (meta?.exportValue) {
        value = meta.exportValue(row);
      } else if (meta?.exportKey) {
        value = getNestedValue(row as Record<string, unknown>, meta.exportKey);
      } else {
        value = '';
      }

      exportRow[label] = formatExportValue(value);
    }

    return exportRow;
  });
}

export function downloadExcel(rows: Record<string, unknown>[], filename: string): void {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
