import { z } from 'zod';

export const baseInvoiceSchema = z
  .object({
    date: z.coerce.date({
      errorMap: () => ({ message: 'Invalid date' })
    }),
    dueDate: z.coerce.date({
      errorMap: () => ({ message: 'Invalid due date' })
    }),
    object: z.string().min(1, 'Object is required'),
    generalConditions: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
    enterpriseId: z.number({
      errorMap: () => ({ message: 'Enterprise is required' })
    }),
    interlocutorId: z.number({
      errorMap: () => ({ message: 'Interlocutor is required' })
    }),
    currencyId: z.number({
      errorMap: () => ({ message: 'Currency is required' })
    }),
    bankAccountId: z.number({
      errorMap: () => ({ message: 'Bank account is required' })
    }),
    taxStamp: z.coerce.number().min(0, 'Tax stamp must be zero or positive').optional()
  })
  .refine((data) => new Date(data.dueDate) >= new Date(data.date), {
    message: 'Due date must be the same or after the date',
    path: ['dueDate']
  });

export const createDraftInvoiceSchema = baseInvoiceSchema;
export const updateInvoiceSchema = baseInvoiceSchema;
