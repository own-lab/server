import { objectsToArray } from '@home-lab/server/core/helpers';
import { HttpModule, Module } from '@nestjs/common';
import * as Services from './services';

@Module({
  imports: [HttpModule],
  providers: [...objectsToArray(Services)],
  exports: [...objectsToArray(Services)],
})
export class SharedModule {}
