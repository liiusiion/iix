import { z } from 'zod';

export const AuthConfigSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  FRONTEND_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

export type AuthConfig = z.infer<typeof AuthConfigSchema>;

export const authConfig = AuthConfigSchema.parse(process.env);
