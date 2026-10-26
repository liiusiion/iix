import { index, text, timestamp } from 'drizzle-orm/pg-core';
import { commonFields } from '../../helpers/common-fields.db';
import { mainSchema } from '../pg-schemas';

export const verifications = mainSchema.table(
  'verifications',
  {
    ...commonFields,
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
  },
  (verification) => [index('verifications_identifier_idx').on(verification.identifier)],
);
