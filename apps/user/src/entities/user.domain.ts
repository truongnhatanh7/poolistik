import { UserRole } from 'infrastructure/auth/role/role.enum';
import BaseDomainEntity from 'infrastructure/domain/base-domain-entity';

export class UserDomain extends BaseDomainEntity {
  username: string;
  password: string;
  email: string;
  role: UserRole;
  sessionToken: string;
  lastLoggedInTime: Date;
  failedLoginCount: number;
}
