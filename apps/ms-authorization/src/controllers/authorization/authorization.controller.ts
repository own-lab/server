import { Body, Controller, Post } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication/authentication.service';

interface AuthorizationDto {
  name: string;
  password: string;
}

@Controller('/authorization')
export class AuthorizationController {
  public constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post('/authorize')
  public authorize(
    @Body() authorizationDto: AuthorizationDto
  ): Observable<{ token: string }> {
    return this.authenticationService
      .authenticate(authorizationDto.name, authorizationDto.password)
      .pipe(
        switchMap((valid) => {
          if (!valid) {
            return throwError('Invalid');
          }

          return of({ token: 'TOKEN' });
        })
      );
  }
}
