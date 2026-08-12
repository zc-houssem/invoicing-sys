import { z } from 'zod';

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return undefined;
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return `https://${trimmed}`;
      }
      return trimmed;
    }
    return value;
  },
  z.string().url().optional()
);

const optionalNotes = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}, z.string().optional());

const optionalString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().optional()
);

const optionalEmail = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().email().optional()
);

export const baseEnterpriseInformationValidationSchema = z.object({
  name: z
    .string({
      required_error: 'enterprise.validation.name_required'
    })
    .min(1, 'enterprise.validation.name_required'),
  taxId: optionalString,
  phone: optionalString,
  email: optionalEmail,
  notes: optionalNotes,
  website: optionalUrl,
  particular: z.boolean(),
  logoId: z.number().optional(),
  activityId: z.number().optional(),
  currencyId: z.number().optional(),
  paymentConditionId: z.number().optional()
});

const requiresTaxId = (data: z.infer<typeof baseEnterpriseInformationValidationSchema>) => {
  if (data.particular) {
    return true;
  }

  return typeof data.taxId === 'string' && data.taxId.trim() !== '';
};

export const createEnterpriseValidationSchema = baseEnterpriseInformationValidationSchema.refine(
  requiresTaxId,
  {
    message: 'enterprise.validation.tax_id_required',
    path: ['taxId']
  }
);

export const updateEnterpriseValidationSchema = baseEnterpriseInformationValidationSchema.refine(
  requiresTaxId,
  {
    message: 'enterprise.validation.tax_id_required',
    path: ['taxId']
  }
);
