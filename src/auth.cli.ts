import { createAuth } from './auth.js';
import { db } from './common/modules/drizzle/drizzle.module.js';
import { EmailService } from './modules/services/email/email.service.js';

// The Better Auth CLI can't use Nest DI and needs an exported `auth` instance. Not used by the app.
export const auth = createAuth({ db, emailService: new EmailService() });
