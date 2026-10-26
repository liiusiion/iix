import { boolean, text, varchar } from 'drizzle-orm/pg-core';
import { commonFields } from '../../helpers/common-fields.db';
import { mainSchema } from '../pg-schemas';

export const Role = {
  Guest: 'Guest',
  Admin: 'Admin',
  BookingManager: 'Booking Manager',
} as const;

export const role = mainSchema.enum('role', [Role.Guest, Role.Admin, Role.BookingManager]);

export const users = mainSchema.table('users', {
  ...commonFields,
  firstName: varchar({ length: 50 }).notNull(),
  lastName: varchar({ length: 50 }),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  phone: varchar({ length: 12 }),
  role: role().notNull().default(Role.Guest),
});
