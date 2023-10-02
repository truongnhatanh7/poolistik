export default class BasePostgresDomainEntity<
  T extends BasePostgresDomainEntity<T>,
> {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  createdby: string;

  updatedBy: string;

  deleteAt: string;
}
