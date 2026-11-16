import type z from 'zod';
import { CommonFieldsSchema } from './common-fields-response.schema.js';

export const EntityIdResponseSchema = CommonFieldsSchema.pick({
  id: true,
});

export type EntityIdResponseDto = z.infer<typeof EntityIdResponseSchema>;
