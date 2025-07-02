import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((response) => {
        if (
          typeof response === 'object' &&
          response !== null &&
          'status_code' in response &&
          'message' in response &&
          'data' in response
        ) {
          return response;
        }

        return {
          status_code: res.statusCode,
          message:
            typeof response === 'object' && response?.message
              ? response.message
              : 'Success',
          data:
            typeof response === 'object' && 'data' in response
              ? response.data
              : response,
        };
      }),
    );
  }
}
