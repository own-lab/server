import { objectsToArray } from '@home-lab/server/core/helpers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'libs/shared/src';
import * as Controllers from './controllers';
import * as Entities from './entities';
import * as Services from './services';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `${__dirname}/database.db`,
      synchronize: true,
      logging: false,
      entities: [...objectsToArray(Entities)],
    }),
    TypeOrmModule.forFeature([...objectsToArray(Entities)]),
  ],
  controllers: [...objectsToArray(Controllers)],
  providers: [...objectsToArray(Services)],
})
export class UserModule {}
