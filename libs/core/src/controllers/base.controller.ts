import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ObjectID } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { NotFoundInterceptor } from '../interceptors';
import { BaseService } from '../services/base.service';

export interface BaseController<T> {
  findAll(): Observable<T[]>;
  findOne(id: ObjectID): Observable<T>;
  create(dto: T): void;
  update(id: ObjectID, dto: T): void;
  delete(id: ObjectID): void;
}

export function BaseController<T extends BaseEntity>(
  service: Type<any>
): Type<BaseController<T>> {
  class BaseControllerHost {
    @Inject(service)
    protected readonly service: BaseService<T>;

    @Get('/')
    @MessagePattern('list')
    public findAll(): Observable<T[]> {
      return this.service.findAll();
    }

    @Get('/:id')
    @MessagePattern('getById')
    @UseInterceptors(NotFoundInterceptor)
    public findOne(@Param('id') id: ObjectID): Observable<T> {
      return this.service.findOne(id);
    }

    @Post()
    @MessagePattern('create')
    @HttpCode(HttpStatus.CREATED)
    public create(@Body() entityDto: T): void {
      this.service.create(entityDto);
    }

    @Put('/:id')
    @MessagePattern('update')
    @HttpCode(HttpStatus.NO_CONTENT)
    public update(@Param('id') id: ObjectID, @Body() entityDto: T): void {
      this.service.update(id, entityDto);
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public patch(@Param('id') id: ObjectID, @Body() entityDto: T): void {
      this.service.patch(id, entityDto);
    }

    @Delete('/:id')
    @MessagePattern('delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    public delete(@Param('id') id: ObjectID): void {
      this.service.delete(id);
    }
  }

  return BaseControllerHost;
}
