import { CommonFieldsSchema } from '../../../common/dto/response/common-fields-response.schema.js';
import z from 'zod';
import { CreatePropertySchema } from '../request/create-property.schema.js';

export const RetrievePropertySchema = z.object({
  ...CommonFieldsSchema.shape,
  title: CreatePropertySchema.shape.title,
  type: CreatePropertySchema.shape.type,
  capacity: CreatePropertySchema.shape.capacity,
  price: CreatePropertySchema.shape.price,
  rating: CreatePropertySchema.shape.rating.nullable(),
  description: CreatePropertySchema.shape.description,
  photos: z.string().array().nullable(),
});

export type RetrievePropertyResponseDto = z.infer<typeof RetrievePropertySchema>;
