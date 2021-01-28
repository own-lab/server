import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        switch (true) {
          case error ===
            'Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters':
          case error.name === 'EntityNotFound':
            throw new NotFoundException();
        }

        return of(error);
      })
    );
  }
}
