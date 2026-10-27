import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly loggerService = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = performance.now();
    const [path] = req.originalUrl.split('?');

    res.on('finish', () => {
      const duration = Math.round(performance.now() - startedAt);

      const statusCode = res.statusCode as HttpStatus;
      const status = `${statusCode} ${HttpStatus[statusCode] ?? ''}`.trim();

      const message = `${req.method} ${path} → ${status} · ${duration}ms`;

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.loggerService.error(message);
      } else if (statusCode >= HttpStatus.BAD_REQUEST) {
        this.loggerService.warn(message);
      } else {
        this.loggerService.debug(message);
      }
    });

    next();
  }
}
