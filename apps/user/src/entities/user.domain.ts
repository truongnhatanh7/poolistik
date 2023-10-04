import BaseDomainEntity from 'infrastructure/domain/base-domain-entity';

export class UserDomain extends BaseDomainEntity {
  username: string;
  password: string;
  sessionToken: string;
  lastLoggedInTime: Date;
  failedLoginCount: number;
}
