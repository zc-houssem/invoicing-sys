import { z } from 'zod';

// Translation function - this should be passed as a parameter or imported from your i18n setup
// For now, using a placeholder that returns the key

const baseUserSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'userManagement.validation.invalidUsernameFormat'
    })
    .min(3, {
      message: 'userManagement.validation.invalidUsernameLength'
    }),
  email: z.string().email({ message: 'userManagement.validation.invalidEmail' }),

  firstName: z
    .string()
    .min(3, {
      message: 'userManagement.validation.invalidFirstNameLength'
    })
    .max(50, {
      message: 'userManagement.validation.firstNameTooLong'
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'userManagement.validation.invalidFirstNameFormat'
    })
    .nullable()
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(3, {
      message: 'userManagement.validation.invalidLastNameLength'
    })
    .max(50, { message: 'userManagement.validation.lastNameTooLong' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'userManagement.validation.invalidLastNameFormat'
    })
    .nullable()
    .optional()
    .or(z.literal('')),
  dateOfBirth: z
    .preprocess(
      (value) =>
        value === null || value === '' || value === undefined ? null : new Date(value as string),
      z.union([z.date(), z.null()]).refine(
        (birthDate) => {
          if (!birthDate) return true;

          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const isBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

          return age > 13 || (age === 13 && isBirthdayPassed);
        },
        { message: 'userManagement.validation.invalidAge' }
      )
    )
    .optional(),
  pictureId: z.number().nullable().optional(),
  isActive: z.boolean().optional(),
  isApproved: z.boolean().optional()
});

const createUserSchema = baseUserSchema
  .extend({
    password: z.string().min(8, {
      message: 'userManagement.validation.invalidPasswordLength'
    }),
    confirmPassword: z.string().optional(),
    roleId: z
      .string({
        message: 'userManagement.validation.roleRequired'
      })
      .min(1, {
        message: 'userManagement.validation.roleRequired'
      })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'userManagement.validation.passwordMismatch',
    path: ['confirmPassword']
  });

function updateUserSchema(requirePasswordUpdate: boolean) {
  return baseUserSchema
    .extend({
      password: requirePasswordUpdate
        ? z
            .string()
            .min(8, {
              message: 'userManagement.validation.invalidPasswordLength'
            })
            .optional()
        : z.string().optional(),
      confirmPassword: z.string().optional(),
      roleId: z
        .string({
          message: 'userManagement.validation.roleRequired'
        })
        .min(1, {
          message: 'userManagement.validation.roleRequired'
        })
    })
    .superRefine((data, ctx) => {
      if (requirePasswordUpdate) {
        if (!data.password || data.password.length < 8) {
          ctx.addIssue({
            path: ['password'],
            message: 'userManagement.validation.invalidPasswordLength',
            code: 'custom'
          });
        }

        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            path: ['confirmPassword'],
            message: 'userManagement.validation.passwordMismatch',
            code: 'custom'
          });
        }
      }
    });
}

export { baseUserSchema, createUserSchema, updateUserSchema };
