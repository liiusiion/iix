import { timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { commonFields } from '../../helpers/common-fields.db';
import { mainSchema } from '../pg-schemas';
import { users } from './users.table';
import { defineRelationsPart } from 'drizzle-orm';
import { properties } from './properties.table';

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

export const bookings = mainSchema.table('bookings', {
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
  userId: uuid()
    .references(() => users.id)
    .notNull(),
});

export const bookingsRelations = defineRelationsPart({ bookings, users, properties }, (rel) => ({
  bookings: {
    guest: rel.one.users({
      from: rel.bookings.userId,
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
}));
