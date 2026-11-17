import { check, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { commonFields } from '../../helpers/common-fields.db.js';
import { mainSchema } from '../pg-schemas.js';
import { users } from './users.table.js';
import { defineRelationsPart, sql } from 'drizzle-orm';
import { properties } from './properties.table.js';

export const BookingStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
  Rejected: 'Rejected',
} as const;

export const bookingStatus = mainSchema.enum('booking_status', [
  BookingStatus.Pending,
  BookingStatus.Confirmed,
  BookingStatus.Cancelled,
  BookingStatus.Rejected,
]);

/**
 * `bookings_no_overlap` lives in custom migration SQL, since drizzle can't express exclusion
 * constraints: active bookings of the same property can't overlap.
 */
export const bookings = mainSchema.table(
  'bookings',
  {
    ...commonFields,
    status: bookingStatus().notNull(),
    startDate: timestamp({
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    endDate: timestamp({
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    message: varchar({ length: 1000 }),
    propertyId: uuid()
      .references(() => properties.id)
      .notNull(),
    guestId: uuid()
      .references(() => users.id)
      .notNull(),
  },
  (booking) => [check('valid_date_range', sql`${booking.startDate} < ${booking.endDate}`)],
);

export const bookingsRelations = defineRelationsPart({ bookings, users, properties }, (rel) => ({
  bookings: {
    guest: rel.one.users({
      from: rel.bookings.guestId,
      to: rel.users.id,
    }),
    property: rel.one.properties({
      from: rel.bookings.propertyId,
      to: rel.properties.id,
    }),
  },
  properties: {
    bookings: rel.many.bookings({
      from: rel.properties.id,
      to: rel.bookings.propertyId,
    }),
  },
  users: {
    bookings: rel.many.bookings({
      from: rel.users.id,
      to: rel.bookings.guestId,
    }),
  },
}));
