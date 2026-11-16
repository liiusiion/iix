import { Injectable, Logger } from '@nestjs/common';
import { Email } from './types/email-service.types.js';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  // TODO: send through Resend; until then emails are only logged
  public send(email: Email): Promise<void> {
    this.logger.log(`To: ${email.to}\nSubject: ${email.subject}\n\n${email.text}`);
    return Promise.resolve();
  }
}
