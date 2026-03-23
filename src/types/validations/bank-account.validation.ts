import { z } from 'zod';

const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;

export const bankAccountSchema = z.object({
  name: z
    .string({ required_error: 'Nom de la banque est obligatoire' })
    .min(3, { message: 'Nom de la banque doit comporter au moins 3 caractères' }),

  currencyId: z.number({
    required_error: 'Devise est obligatoire'
  }),

  bic: z
    .string()
    .transform((val) => val?.toUpperCase().replace(/\s+/g, ''))
    .refine((val) => !val || bicRegex.test(val), {
      message: 'BIC/SWIFT invalide'
    }),
  iban: z
    .string()
    .transform((val) => val?.toUpperCase().replace(/\s+/g, ''))
    .refine((val) => !val || ibanRegex.test(val), {
      message: 'IBAN invalide'
    }),
  rib: z.string().min(1, { message: 'RIB est obligatoire' }).optional(),

  isMain: z.boolean().optional()
});

export const createBankAccountSchema = bankAccountSchema;
export const updateBankAccountSchema = bankAccountSchema.partial();
