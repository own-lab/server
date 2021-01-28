import { objectsToArray } from '@home-lab/server/core/helpers';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from 'libs/shared/src';
import * as Controllers from './controllers';
import * as Services from './services';

@Module({
  imports: [ScheduleModule.forRoot(), SharedModule],
  controllers: [...objectsToArray(Controllers)],
  providers: [...objectsToArray(Services)],
})
export class ContainerManagerModule {}
