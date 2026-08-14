import { z } from 'zod';

export const createTaxRateSchema = z.object({
  label: z.string().min(3, { message: 'label_length_error' }),
  value: z.number().positive({ message: 'value_interval_error' }),
  type: z.enum(['rate', 'fixed']),
  special: z.boolean(),
  currencyId: z.number().nullable().optional()
});

export const updateTaxRateSchema = createTaxRateSchema.partial();
