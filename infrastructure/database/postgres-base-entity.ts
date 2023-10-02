import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export default class BasePostgresEntity<
  T extends BasePostgresEntity<T>,
> extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_at' })
  updatedAt: Date;

  @Column({ name: 'created_by' })
  createdby: string;

  @Column({ name: 'created_by' })
  updatedBy: string;

  @Column({ name: 'delete_at' })
  deleteAt: Date;
}
