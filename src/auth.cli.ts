import { createAuth } from './auth';
import { db } from './common/modules/drizzle/drizzle.module';
import { EmailService } from './modules/services/email/email.service';

// The Better Auth CLI can't use Nest DI and needs an exported `auth` instance. Not used by the app.
export const auth = createAuth({ db, emailService: new EmailService() });
