import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DrizzleModule } from './common/modules/drizzle/drizzle.module';
import { PropertiesRepositoryModule } from './modules/repositories/properties/properties-repository.module';
import { PropertiesModule } from './modules/services/properties/properties.module';
import { PropertiesController } from './entrypoints/api/properties/properties.controller';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [DrizzleModule, PropertiesRepositoryModule, PropertiesModule],
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
