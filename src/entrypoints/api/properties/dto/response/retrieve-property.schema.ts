import { CommonFieldsSchema } from '../../../common/dto/response/common-fields-response.schema';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { CreatePropertySchema } from '../request/create-property.schema';

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

export class RetrievePropertyResponseDto extends createZodDto(RetrievePropertySchema) {}
