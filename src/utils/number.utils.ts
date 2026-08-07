export const ciel = (value: number, digitAfterComma: number = 2) => {
  const factor = Math.pow(10, digitAfterComma);
  return Math.round(value * factor) / factor;
};
export const getValidId = (val: any) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
  if (typeof val === 'object' && val !== null && val.id) return Number(val.id);
  return null;
};
