import { Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { InsertResult, ObjectID, Repository } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export interface BaseService<T> {
  findAll(where?: any): Observable<T[]>;
  findOne(id: ObjectID): Observable<T>;
  findOneBy(select: any): Observable<T>;
  create(dto: T): Observable<InsertResult>;
  update(id: ObjectID, dto: T): void;
  patch(id: ObjectID, dto: T): void;
  delete(id: ObjectID): void;
}

export function BaseService<T extends BaseEntity>(
  entityClass: Type<any>
): Type<BaseService<T>> {
  class BaseServiceHost {
    @InjectRepository(entityClass)
    protected readonly repository: Repository<T>;

    public findAll(where: any = {}): Observable<T[]> {
      return from(this.repository.find(where));
    }

    public findOne(id: ObjectID): Observable<T> {
      return this.findOneBy({ id });
    }

    public findOneBy(where: any): Observable<T> {
      return from(this.repository.findOneOrFail({ where }));
    }

    public create(dto: T): Observable<InsertResult> {
      return from(this.repository.insert(dto as any));
    }

    public update(id: ObjectID, dto: T): void {
      this.repository.update(id, dto as any);
    }

    public patch(id: ObjectID, dto: T): void {
      this.repository.update(id, dto as any);
    }

    public delete(id: ObjectID): void {
      this.repository.delete(id);
    }
  }

  return BaseServiceHost;
}
