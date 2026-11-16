import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { DrizzleDb } from './common/modules/drizzle/drizzle.module.js';
import { authConfig } from './configs/auth.config.js';
import { Role } from './db/schema/index.js';
import { EmailService } from './modules/services/email/email.service.js';

type AuthDependencies = {
  db: DrizzleDb;
  emailService: EmailService;
};

export const createAuth = ({ db, emailService }: AuthDependencies) =>
  betterAuth({
    appName: 'liili',
    baseURL: authConfig.BETTER_AUTH_URL,
    secret: authConfig.BETTER_AUTH_SECRET,
    trustedOrigins: [authConfig.FRONTEND_URL],

    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
    }),

    advanced: {
      database: {
        generateId: 'uuid',
      },
    },

    user: {
      fields: {
        name: 'firstName',
      },
      additionalFields: {
        lastName: {
          type: 'string',
          required: false,
        },
        phone: {
          type: 'string',
          required: false,
        },
        role: {
          type: [Role.Guest, Role.Admin, Role.BookingManager],
          required: false,
          input: false,
          defaultValue: Role.Guest,
        },
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },

    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: ({ user, url }) => {
        // not awaited, so response timing doesn't reveal anything about the email
        void emailService.send({
          to: user.email,
          subject: 'Confirm your email for Liili',
          text: `Confirm your email by opening this link: ${url}`,
        });
        return Promise.resolve();
      },
    },

    socialProviders: {
      google: {
        clientId: authConfig.GOOGLE_CLIENT_ID,
        clientSecret: authConfig.GOOGLE_CLIENT_SECRET,
        // Google's `name` is the full name, but ours is the first name
        mapProfileToUser: (profile) => ({
          name: profile.given_name ?? profile.name,
          lastName: profile.family_name ?? null,
        }),
      },
    },

    plugins: [openAPI()],
  });

export type Auth = ReturnType<typeof createAuth>;
