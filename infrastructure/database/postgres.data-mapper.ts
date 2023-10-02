import BasePostgresDomainEntity from './postgres-base-domain-entity';
import BasePostgresEntity from './postgres-base-entity';

export abstract class PostgresDataMapper<
  TDomainEntity extends BasePostgresDomainEntity<TDomainEntity>,
  TOrmEntity extends BasePostgresEntity<TOrmEntity>,
> {
  abstract toOrmProps(
    domainEntity: BasePostgresDomainEntity<TDomainEntity>,
  ): BasePostgresEntity<TOrmEntity>;

  abstract toDomainProps(
    ormEntity: BasePostgresEntity<TOrmEntity>,
  ): BasePostgresDomainEntity<TDomainEntity>;

  toDomainEntity<T extends BasePostgresEntity<T>>(
    ormEntity: BasePostgresEntity<T>,
  ): BasePostgresDomainEntity<TDomainEntity> {
    return {
      id: ormEntity.id,
      ...this.toDomainProps(ormEntity),
    };
  }

  toOrmEntity(
    domainEntity: BasePostgresDomainEntity<TDomainEntity>,
  ): BasePostgresEntity<TOrmEntity> {
    const domainInstance = this.toOrmProps(domainEntity);
    if (!domainInstance.id) {
      domainInstance.id = domainEntity.id;
    }
    return domainInstance;
  }
}
