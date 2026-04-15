/* eslint-disable @typescript-eslint/no-explicit-any */
export const createSearchFilterExpression = (
  structure: any,
  operator: string,
  value: string,
  seperator: string
): string => {
  return `(${Object.values(structure)
    .map((svalue) => `${svalue}${operator}${value}`)
    .join(seperator)}})`;
};

export const parseBooleanField = (field: string | string[] | boolean | undefined): boolean => {
  if (typeof field === 'string') {
    return field === 'true';
  }
  if (Array.isArray(field)) {
    return field[0] === 'true';
  }
  return false;
};

export const parseIntField = (field: string | string[] | number | undefined): number => {
  if (typeof field === 'string') {
    return parseInt(field, 10);
  }
  if (Array.isArray(field)) {
    return parseInt(field[0], 10);
  }
  return 0;
};

export const parseStringField = (field: string | string[] | number | undefined): string => {
  if (typeof field === 'string') {
    return field;
  }
  if (Array.isArray(field)) {
    return field[0];
  }
  return '';
};

export const setDeepValue = <T>(obj: any, path: string, value: T): any => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const nested = keys.reduce((acc, key) => {
    if (typeof acc[key] !== 'object' || acc[key] === null) {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  if (lastKey) nested[lastKey] = value;
  return obj;
};

export const safeStringify = (obj: any) => {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    },
    2
  );
};

export const stableStringify = (value: any): string => {
  const seen = new WeakSet();
  const sortKeys = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      if (seen.has(obj)) return;
      seen.add(obj);
      if (Array.isArray(obj)) {
        return obj.map(sortKeys);
      }
      const sorted: Record<string, any> = {};
      Object.keys(obj)
        .sort()
        .forEach((k) => {
          sorted[k] = sortKeys(obj[k]);
        });
      return sorted;
    }
    return obj;
  };
  return JSON.stringify(sortKeys(value));
};

export const deepEqual = (a: any, b: any) => {
  return stableStringify(a) === stableStringify(b);
};

export function setDeep<T extends object>(obj: T, path: string, value: any): T {
  const keys = path.split('.');

  const clone: any = Array.isArray(obj) ? [...obj] : { ...obj };
  let current: any = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    const isIndex = !isNaN(Number(key));
    const isNextIndex = !isNaN(Number(nextKey));

    const next = isIndex ? current[Number(key)] : current[key];

    const newValue =
      next !== undefined ? (Array.isArray(next) ? [...next] : { ...next }) : isNextIndex ? [] : {};

    if (isIndex) {
      current[Number(key)] = newValue;
      current = current[Number(key)];
    } else {
      current[key] = newValue;
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  const isLastIndex = !isNaN(Number(lastKey));

  const prevValue = isLastIndex ? current[Number(lastKey)] : current[lastKey];

  const finalValue = typeof value === 'function' ? value(prevValue) : value;

  if (isLastIndex) {
    current[Number(lastKey)] = finalValue;
  } else {
    current[lastKey] = finalValue;
  }

  return clone as T;
}
