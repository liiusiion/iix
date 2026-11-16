import { BadRequestException, Injectable, StandardSchemaValidationPipe } from '@nestjs/common';

@Injectable()
export class SchemaValidationPipe extends StandardSchemaValidationPipe {
  constructor() {
    super({
      exceptionFactory: (issues) =>
        new BadRequestException({
          message: 'Request validation failed.',

          errors: issues.map((issue) => {
            const field = (issue.path ?? [])
              .map((segment) => String(typeof segment === 'object' ? segment.key : segment))
              .join('.');

            return `Field '${field}'. ${issue.message}`;
          }),
        }),
    });
  }
}
