import { z } from 'zod';

const baseUserSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(3),
  email: z.string().email(),
  firstName: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/)
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/)
    .optional()
    .or(z.literal('')),
  dateOfBirth: z
    .preprocess(
      (value) =>
        value === null || value === '' || value === undefined ? null : new Date(value as string),
      z.union([z.date(), z.null()]).refine((birthDate) => {
        if (!birthDate) return true;
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isBirthdayPassed =
          today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        return age > 13 || (age === 13 && isBirthdayPassed);
      })
    )
    .optional(),
  pictureId: z.number().optional(),
  isActive: z.boolean().optional(),
  isApproved: z.boolean().optional()
});

const updateUserSchema = (requirePasswordUpdate: boolean) => {
  return baseUserSchema
    .extend({
      password: requirePasswordUpdate ? z.string().min(8).optional() : z.string().optional(),
      confirmPassword: z.string().optional(),
      roleId: z.string().min(1)
    })
    .superRefine((data, ctx) => {
      if (requirePasswordUpdate) {
        if (!data.password || data.password.length < 8) {
          ctx.addIssue({
            path: ['password'],
            message: 'invalidPasswordLength',
            code: 'custom'
          });
        }
        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            path: ['confirmPassword'],
            message: 'passwordMismatch',
            code: 'custom'
          });
        }
      }
    });
};

const updateDto = {
  firstName: null,
  lastName: null,
  dateOfBirth: undefined,
  isActive: true,
  isApproved: true,
  username: 'admin_user',
  email: 'admin@example.com',
  password: '',
  roleId: 'clxxxxxx',
  pictureId: undefined,
  confirmPassword: ''
};

const result = updateUserSchema(false).safeParse(updateDto);
console.log(JSON.stringify(result, null, 2));
