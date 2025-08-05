import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message'] || exception.message
        : 'Internal server error';

    const errorResponse = {
      status_code: status,
      message:
        typeof message === 'string'
          ? message
          : Array.isArray(message)
            ? message[0]
            : 'Error',
      errors:
        exception instanceof HttpException &&
        typeof exception.getResponse() === 'object' &&
        exception.getResponse()['errors']
          ? exception.getResponse()['errors']
          : null,
    };

    console.error('[EXCEPTION]', {
      status,
      message,
      error: exception,
    });

    res.status(status).json(errorResponse);
  }
}
