import { objectsToArray } from '@home-lab/server/core/helpers';
import { Module } from '@nestjs/common';
import { SharedModule } from 'libs/shared/src';
import * as Controllers from './controllers';
import * as Services from './services';

@Module({
  imports: [SharedModule],
  controllers: [...objectsToArray(Controllers)],
  providers: [...objectsToArray(Services)],
})
export class AuthorizationModule {}
