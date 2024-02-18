import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReplaceEmptyWithNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.body) {
      this.replaceEmptyWithNull(request.body);
    }
    return next.handle();
  }

  private replaceEmptyWithNull(obj: any): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          this.replaceEmptyWithNull(obj[key]);
        } else if (obj[key] === '') {
          obj[key] = null;
        }
      }
    }
  }
}
