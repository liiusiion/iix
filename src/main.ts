import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { apiReference } from '@scalar/nestjs-api-reference';
import { authConfig } from './configs/auth.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Better Auth reads the raw body of its own routes, AuthModule re-adds parsers for the rest
    bodyParser: false,
  });

  app.enableCors({
    origin: authConfig.FRONTEND_URL,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Liili')
    .setDescription('The Liili API description.')
    .setVersion('1.0')
    .addCookieAuth('better-auth.session_token')
    .build();

  const documentFactory = () => cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.use(
    '/reference',
    apiReference({
      content: documentFactory(),
      theme: 'deepSpace',
      defaultOpenAllTags: true,
      hideModels: true,
      expandAllResponses: true,
      orderSchemaPropertiesBy: 'preserve',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
