import BaseDomainEntity from '../domain/base-domain-entity';
import BasePostgresEntity from './postgres-base-entity';

export abstract class PostgresDataMapper<
  T extends BaseDomainEntity,
  R extends BasePostgresEntity,
> {
  abstract toOrmProps(domainEntity: T): R;

  abstract toDomainProps(ormEntity: R): T;

  toDomainEntity(ormEntity: R): T {
    const domainInstance: T = this.toDomainProps(ormEntity);
    return domainInstance;
  }

  toOrmEntity(domainEntity: T): R {
    const ormInstance: R = this.toOrmProps(domainEntity);
    return ormInstance;
  }
}
