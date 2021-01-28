import { BaseEntity } from '@home-lab/server/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @Column()
  name: string;
}
