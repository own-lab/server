import { ObjectIdColumn } from 'typeorm';

export abstract class BaseEntity {
  @ObjectIdColumn({ type: 'integer' })
  id: string;
}
