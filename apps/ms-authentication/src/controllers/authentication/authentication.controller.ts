import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../services';

interface AuthenticationDto {
  name: string;
  password: string;
}

@Controller('/authentication')
export class AuthenticationController {
  constructor(private readonly userService: UserService) {}

  @Post('/authenticate')
  @MessagePattern('authenticate')
  authenticate(
    @Body() authenticationDto: AuthenticationDto
  ): Observable<boolean> {
    return this.userService
      .getOneBy({ ...authenticationDto })
      .pipe(map((user) => user.password === authenticationDto.password));
  }
}
