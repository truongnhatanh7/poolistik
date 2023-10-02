import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export default class BasePostgresEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

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
