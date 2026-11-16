import { Inject } from '@nestjs/common';
import { injectionToken } from '../helpers/injection-token.helper.js';

export const InjectDb = () => Inject(injectionToken.drizzle);
