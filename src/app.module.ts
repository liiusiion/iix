import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DrizzleDb, DrizzleModule } from './common/modules/drizzle/drizzle.module';
import { PropertiesRepositoryModule } from './modules/repositories/properties/properties-repository.module';
import { PropertiesModule } from './modules/services/properties/properties.module';
import { PropertiesController } from './entrypoints/api/properties/properties.controller';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth';
import { EmailModule } from './modules/services/email/email.module';
import { EmailService } from './modules/services/email/email.service';
import { injectionToken } from './common/helpers/injection-token.helper';

@Module({
  imports: [
    DrizzleModule,
    AuthModule.forRootAsync({
      imports: [EmailModule],
      inject: [injectionToken.drizzle, EmailService],
      useFactory: (db: DrizzleDb, emailService: EmailService) => ({
        auth: createAuth({ db, emailService }),
      }),
    }),
    PropertiesRepositoryModule,
    PropertiesModule,
  ],
  controllers: [AppController, PropertiesController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
