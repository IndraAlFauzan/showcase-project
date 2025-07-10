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
      map((resBody) => {
        // If already in the desired format
        if (
          typeof resBody === 'object' &&
          resBody !== null &&
          'status_code' in resBody &&
          'message' in resBody &&
          'data' in resBody
        ) {
          return resBody;
        }

        const status = res.statusCode;
        const message =
          typeof resBody === 'object' && resBody?.message
            ? resBody.message
            : 'Success';

        const data =
          typeof resBody === 'object' && 'data' in resBody
            ? resBody.data
            : resBody;

        return {
          status_code: status,
          message,
          data,
        };
      }),
    );
  }
}
