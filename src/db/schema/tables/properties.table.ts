import { check, integer, real, smallint, text, varchar } from 'drizzle-orm/pg-core';
import { commonFields } from '../../helpers/common-fields.db';
import { sql } from 'drizzle-orm';
import { mainSchema } from '../pg-schemas';

export const PropertyType = {
  Cabin: 'Cabin',
  Room: 'Room',
} as const;

export const propertyType = mainSchema.enum('property_type', [
  PropertyType.Cabin,
  PropertyType.Room,
]);

export const properties = mainSchema.table(
  'properties',
  {
    ...commonFields,
    title: varchar({ length: 100 }).notNull(),
    type: propertyType().notNull(),
    capacity: smallint().notNull(),
    price: integer().notNull(),
    rating: real(),
    description: text().notNull(),
    photos: varchar().array(),
  },
  (property) => [
    check('min_title_length', sql`char_length(${property.title}) >= 3`),
    check('capacity_positive', sql`${property.capacity} >= 1 AND ${property.capacity} <= 100`),
    check('price_positive', sql`${property.price} >= 0`),
    check(
      'rating_valid',
      sql`${property.rating} IS NULL OR (${property.rating} >= 0 AND ${property.rating} <= 5)`,
    ),
  ],
);
