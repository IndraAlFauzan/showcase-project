import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp().getResponse();
        const status = ctx.statusCode ?? 200;

        return {
          status_code: status,
          message: data?.message ?? 'Success',
          data: data?.data ?? data,
        };
      }),
    );
  }
}
