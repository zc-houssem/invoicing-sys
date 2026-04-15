import { z } from 'zod';

export const baseEnterpriseInformationValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(1, 'Name is required'),
  taxId: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  website: z.string().url().optional(),
  particular: z.boolean(),
  activityId: z.number().optional(),
  currencyId: z.number().optional(),
  paymentConditionsId: z.number().optional()
});

export const createEnterpriseValidationSchema = baseEnterpriseInformationValidationSchema.refine(
  (data) => {
    if (data.particular) {
      return true;
    }
    return data.taxId && data.taxId.trim() !== '';
  },
  {
    message: 'Tax ID Number is required for non-particular enterprises',
    path: ['taxId']
  }
);
