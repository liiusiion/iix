import { index, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { commonFields } from '../../helpers/common-fields.db.js';
import { mainSchema } from '../pg-schemas.js';
import { users } from './users.table.js';

export const sessions = mainSchema.table(
  'sessions',
  {
    ...commonFields,
    token: text().notNull().unique(),
    expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (session) => [index('sessions_user_id_idx').on(session.userId)],
);
