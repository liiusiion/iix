import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  constructor() {}

  @AllowAnonymous()
  @Get('we-good')
  getHello() {
    return 'We good.';
  }
}
