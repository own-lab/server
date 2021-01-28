import { Module } from '@nestjs/common';
import { SharedModule } from 'libs/shared/src';
import { AuthenticationController } from './controllers';
import { UserService } from './services';

@Module({
  imports: [SharedModule],
  controllers: [AuthenticationController],
  providers: [UserService],
})
export class AuthenticationModule {}
