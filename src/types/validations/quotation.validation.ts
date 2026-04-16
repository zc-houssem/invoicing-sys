import { z } from 'zod';

export const baseQuotationSchema = z
  .object({
    date: z.date({
      errorMap: () => ({ message: 'Invalid date' })
    }),
    dueDate: z.date({
      errorMap: () => ({ message: 'Invalid due date' })
    }),
    object: z.string().min(1, 'Object is required'),
    generalConditions: z.string().optional().or(z.literal('')),
    enterpriseId: z.number({
      errorMap: () => ({ message: 'Enterprise is required' })
    }),
    interlocutorId: z.number({
      errorMap: () => ({ message: 'Interlocutor is required' })
    })
  })
  .refine((data) => data.dueDate >= data.date, {
    message: 'Due date must be the same or after the date',
    path: ['dueDate']
  });

export const createDraftQuotationSchema = baseQuotationSchema;
export const updateQuotationSchema = baseQuotationSchema;
