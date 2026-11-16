import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { authConfig } from './configs/auth.config.js';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware.js';

// Better Auth's routes and docs live under /api/auth, so everything else goes under /api too
const API_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Better Auth reads the raw body of its own routes, AuthModule re-adds parsers for the rest
    bodyParser: false,
  });

  // Registered globally rather than in AppModule.configure(): AuthModule is a global module, so its
  // middleware (Better Auth's handler) would run first and answer /api/auth/* without reaching ours
  const requestLogger = new RequestLoggerMiddleware();
  app.use(requestLogger.use.bind(requestLogger));

  app.setGlobalPrefix(API_PREFIX);

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

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${API_PREFIX}/swagger`, app, documentFactory, {
    jsonDocumentUrl: `${API_PREFIX}/swagger/json`,
  });

  app.use(
    `/${API_PREFIX}/reference`,
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

await bootstrap();
