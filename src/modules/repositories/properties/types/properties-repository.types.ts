import { properties } from '../../../../db/schema/index.js';

export type CreateProperty = Pick<
  typeof properties.$inferInsert,
  'title' | 'capacity' | 'price' | 'type' | 'rating' | 'description'
>;
