import { z } from 'zod';

export const baseQuotationSchema = z.object({
  date: z.date({
    errorMap: () => ({ message: 'Invalid date' })
  }),
  dueDate: z.date({
    errorMap: () => ({ message: 'Invalid due date' })
  }),
  object: z.string().min(1, 'Object is required'),
  generalConditions: z.string().optional().or(z.literal(''))
});

export const createDraftQuotationSchema = baseQuotationSchema;
export const updateQuotationSchema = baseQuotationSchema.partial();
