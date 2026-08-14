import { z } from 'zod';

export const createEnterpriseMemberSchema = z.object({
  userId: z.string().min(1, { message: 'User is required' }),
  isOwner: z.boolean().optional(),
  enterpriseId: z.number().optional()
});

export const createUserSystemEnterpriseMemberSchema = createEnterpriseMemberSchema.extend({
  enterpriseId: z.number({ message: 'Enterprise is required' })
});
