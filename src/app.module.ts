import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { DrizzleDb, DrizzleModule } from './common/modules/drizzle/drizzle.module.js';
import { PropertiesRepositoryModule } from './modules/repositories/properties/properties-repository.module.js';
import { PropertiesModule } from './modules/services/properties/properties.module.js';
import { PropertiesController } from './entrypoints/api/properties/properties.controller.js';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { StandardSchemaSerializerInterceptor } from '@nestjs/common';
import { SchemaValidationPipe } from './common/pipes/schema-validation.pipe.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth.js';
import { EmailModule } from './modules/services/email/email.module.js';
import { EmailService } from './modules/services/email/email.service.js';
import { injectionToken } from './common/helpers/injection-token.helper.js';

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
      useClass: SchemaValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
