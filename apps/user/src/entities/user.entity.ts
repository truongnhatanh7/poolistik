import BasePostgresEntity from 'infrastructure/database/postgres-base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity extends BasePostgresEntity<UserEntity> {
  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  password: string;
}
