import { UserRole } from 'infrastructure/auth/role/role.enum';
import BasePostgresEntity from 'infrastructure/database/postgres-base-entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends BasePostgresEntity {
  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'email' })
  email: string;

  @Column({
    type: 'enum',
    name: 'role',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column({
    name: 'session_token',
    nullable: true,
  })
  sessionToken: string;

  @Column({
    name: 'last_logged_in_time',
    nullable: true,
  })
  lastLoggedInTime: Date;

  @Column({
    name: 'failed_login_count',
    nullable: true,
  })
  failedLoginCount: number;
}
