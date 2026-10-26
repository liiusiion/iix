import { index, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { commonFields } from '../../helpers/common-fields.db';
import { mainSchema } from '../pg-schemas';
import { users } from './users.table';

// one row per sign-in method: 'credential' rows hold the password hash, 'google' rows link the Google account
export const accounts = mainSchema.table(
  'accounts',
  {
    ...commonFields,
    /** The user's id at the provider, e.g. Google's `sub` */
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true, mode: 'date' }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: 'date' }),
    scope: text(),
    password: text(),
  },
  (account) => [
    index('accounts_user_id_idx').on(account.userId),
    unique('accounts_provider_account_unique').on(account.providerId, account.accountId),
  ],
);
