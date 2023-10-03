import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export default class BasePostgresEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_at', nullable: true })
  createdAt: Date;

  @Column({ name: 'update_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdby: string;

  @Column({ name: 'update_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'delete_at', nullable: true })
  deleteAt: Date;
}
