import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

/** Gives every `HttpException` response the shape `{ statusCode, timestamp, message, ... }`. */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const statusCode = exception.getStatus();

    httpAdapter.reply(
      host.switchToHttp().getResponse(),
      { statusCode, timestamp: new Date(), ...this.getBody(exception) },
      statusCode,
    );
  }

  private getBody(exception: HttpException): object {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return { message: response, errorCode: exception.errorCode };
    }

    // Nest's own body ({ statusCode, message, error }): keep the message, drop the rest
    if ('statusCode' in response) {
      return {
        message: 'message' in response ? response.message : exception.message,
        errorCode: exception.errorCode,
      };
    }

    // A custom body, e.g. the validation error from SchemaValidationPipe
    return response;
  }
}
