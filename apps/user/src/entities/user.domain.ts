import BasePostgresDomainEntity from 'infrastructure/database/postgres-base-domain-entity';

export class UserDomain extends BasePostgresDomainEntity<UserDomain> {
  username: string;

  password: string;
}
