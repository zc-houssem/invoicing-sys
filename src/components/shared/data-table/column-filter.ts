export type DataTableStringFilterOperator = '$eq' | '!$eq' | '$cont' | '$gt' | '$lt';

export const DATA_TABLE_STRING_FILTER_OPERATORS: DataTableStringFilterOperator[] = [
  '$eq',
  '!$eq',
  '$cont',
  '$gt',
  '$lt'
];

export function buildColumnFilter(
  field: string,
  operator: DataTableStringFilterOperator,
  value: string
): string {
  return `${field}||${operator}||${value}`;
}

export function parseColumnFilter(
  filter: string
): { field: string; operator: DataTableStringFilterOperator; value: string } | null {
  const parts = filter.split('||');
  if (parts.length !== 3) return null;

  const [field, operator, value] = parts;
  if (!DATA_TABLE_STRING_FILTER_OPERATORS.includes(operator as DataTableStringFilterOperator)) {
    return null;
  }

  return {
    field,
    operator: operator as DataTableStringFilterOperator,
    value
  };
}

export function buildDataTableFilterString(
  baseFilters: string | string[] = '',
  columnFilters: Record<string, string> = {}
): string {
  const parts = [
    ...(Array.isArray(baseFilters) ? baseFilters : baseFilters ? [baseFilters] : []),
    ...Object.values(columnFilters).filter(Boolean)
  ];

  return parts.join(';');
}

export function buildDateRangeFilter(
  field: string,
  from?: string,
  to?: string
): string | null {
  if (from && to) {
    return `${field}||$between||${from},${to}`;
  }
  if (from) {
    return `${field}||$gte||${from}`;
  }
  if (to) {
    return `${field}||$lte||${to}`;
  }
  return null;
}

export function parseDateRangeFilter(
  filter: string
): { from?: string; to?: string } | null {
  const parts = filter.split('||');
  if (parts.length !== 3) return null;

  const [, operator, value] = parts;

  if (operator === '$between') {
    const [from, to] = value.split(',');
    return { from, to };
  }
  if (operator === '$gte') {
    return { from: value };
  }
  if (operator === '$lte') {
    return { to: value };
  }
  return null;
}

export function parseOptionFilter(
  filter: string
): { field: string; operator: string; value: string } | null {
  const parts = filter.split('||');
  if (parts.length !== 3) return null;

  const [field, operator, value] = parts;
  if (!field || !operator) return null;

  return { field, operator, value };
}

export function getOptionFilterField(options: { filter: string }[]): string | null {
  return options[0] ? parseOptionFilter(options[0].filter)?.field ?? null : null;
}

export function getOptionFilterValue(option: { filter: string }): string | null {
  return parseOptionFilter(option.filter)?.value ?? null;
}

export function getSelectedOptionFilterValues(activeFilter?: string): string[] {
  if (!activeFilter) return [];

  const parsed = parseOptionFilter(activeFilter);
  if (!parsed) return [];

  if (parsed.operator === '$in') {
    return parsed.value.split(',').filter(Boolean);
  }
  if (parsed.operator === '$eq') {
    return [parsed.value];
  }

  return [];
}

export function buildMultiOptionFilter(field: string, values: string[]): string | null {
  if (values.length === 0) return null;
  if (values.length === 1) return `${field}||$eq||${values[0]}`;
  return `${field}||$in||${values.join(',')}`;
}

export function toggleOptionFilterValue(
  activeFilter: string | undefined,
  options: { filter: string }[],
  optionValue: string
): string | null {
  const field = getOptionFilterField(options);
  if (!field) return null;

  const selectedValues = getSelectedOptionFilterValues(activeFilter);
  const nextValues = selectedValues.includes(optionValue)
    ? selectedValues.filter((value) => value !== optionValue)
    : [...selectedValues, optionValue];

  return buildMultiOptionFilter(field, nextValues);
}
