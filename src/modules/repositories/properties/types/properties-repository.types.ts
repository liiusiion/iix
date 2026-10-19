import { properties } from '../../../../db/schema';

export type CreateProperty = Pick<
  typeof properties.$inferInsert,
  'title' | 'capacity' | 'price' | 'type' | 'rating' | 'description'
>;
