import { z } from 'zod';
import { propertyType } from '../../../../../db/schema';
import { createZodDto } from 'nestjs-zod';

export const CreatePropertySchema = z.object({
  title: z.string().min(3).max(100).meta({
    example: '4-person cabin',
  }),
  type: z.enum(propertyType.enumValues),
  capacity: z.number().int().positive().min(1).max(100),
  price: z.number().int().min(0),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().min(10).meta({
    example: 'This is a nice cabin.',
  }),
});

export type CreateProperty = z.infer<typeof CreatePropertySchema>;

export class CreatePropertyDto extends createZodDto(CreatePropertySchema) {}
