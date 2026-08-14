import { z } from 'zod';

export const createInterlocutorValidationSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, 'interlocutor.validation.name_required'),
  lastName: z.string().min(1, 'interlocutor.validation.surname_required'),
  email: z.string().email('interlocutor.validation.email_invalid').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal(''))
});

export const updateInterlocutorValidationSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, 'interlocutor.validation.name_required'),
  lastName: z.string().min(1, 'interlocutor.validation.surname_required'),
  email: z.string().email('interlocutor.validation.email_invalid').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal(''))
});
