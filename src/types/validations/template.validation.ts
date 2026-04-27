import { z } from 'zod';
import { TemplateType } from '../core/template';

export const templateSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters' }),

  description: z.string().optional(),
  templateType: z.nativeEnum(TemplateType, {
    required_error: 'Template type is required'
  }),
  documentId: z.number({
    required_error: 'Document ID is required',
    invalid_type_error: 'Document ID must be a number'
  }),
  variables: z.record(z.any()).optional()
});
