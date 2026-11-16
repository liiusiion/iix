import type z from 'zod';
import { CommonFieldsSchema } from '../response/common-fields-response.schema.js';

export const EntityIdPathSchema = CommonFieldsSchema.pick({
  id: true,
});

export type EntityIdPathDto = z.infer<typeof EntityIdPathSchema>;
