import { PostgresDataMapper } from 'infrastructure/database/postgres.data-mapper';
import { UserDomain } from './user.domain';
import { UserEntity } from './user.entity';

export class UserDataMapper extends PostgresDataMapper<UserDomain, UserEntity> {
  constructor() {
    super();
  }

  toDomainProps(ormEntity: UserEntity): UserDomain {
    const userDomainInstance = new UserDomain();
    userDomainInstance.id = ormEntity.id;
    userDomainInstance.username = ormEntity.username;
    userDomainInstance.role = ormEntity.role;
    userDomainInstance.password = ormEntity.password;
    userDomainInstance.createdAt = ormEntity.createdAt;
    userDomainInstance.createdby = ormEntity.createdby;
    userDomainInstance.updatedAt = ormEntity.updatedAt;
    userDomainInstance.updatedBy = ormEntity.updatedBy;
    userDomainInstance.deleteAt = ormEntity.deleteAt;
    userDomainInstance.sessionToken = ormEntity.sessionToken;
    userDomainInstance.lastLoggedInTime = ormEntity.lastLoggedInTime;
    userDomainInstance.failedLoginCount = ormEntity.failedLoginCount;
    return userDomainInstance;
  }

  toOrmProps(domainEntity: UserDomain): UserEntity {
    const userOrmInstance = new UserEntity();
    userOrmInstance.id = domainEntity.id;
    userOrmInstance.username = domainEntity.username;
    userOrmInstance.password = domainEntity.password;
    userOrmInstance.role = domainEntity.role;
    userOrmInstance.createdAt = domainEntity.createdAt;
    userOrmInstance.createdby = domainEntity.createdby;
    userOrmInstance.updatedAt = domainEntity.updatedAt;
    userOrmInstance.updatedBy = domainEntity.updatedBy;
    userOrmInstance.deleteAt = domainEntity.deleteAt;
    userOrmInstance.sessionToken = domainEntity.sessionToken;
    userOrmInstance.lastLoggedInTime = domainEntity.lastLoggedInTime;
    userOrmInstance.failedLoginCount = domainEntity.failedLoginCount;
    return userOrmInstance;
  }
}
