import { objectsToArray } from '@home-lab/server/core/helpers';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { SharedModule } from 'libs/shared/src';
import * as Controllers from './controllers';
import * as Services from './services';

@Module({
  imports: [TerminusModule, ScheduleModule.forRoot(), SharedModule],
  controllers: [...objectsToArray(Controllers)],
  providers: [...objectsToArray(Services)],
})
export class RegistryModule {}
