import { FindOptionsWhere, Repository } from 'typeorm';
import BasePostgresEntity from './postgres-base-entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PageOptionsDto } from 'infrastructure/libs/pagination/page-options.dto';
import { PageMetaDto } from 'infrastructure/libs/pagination/page.meta';
import { PageDto } from 'infrastructure/libs/pagination/page.dto';

export class PostgresBaseRepository<T extends BasePostgresEntity> {
  constructor(private readonly repo: Repository<T>) {}

  async create(entity: T): Promise<T> {
    return await this.repo.save(entity);
  }

  async findOne(filterQuery: FindOptionsWhere<T>): Promise<T> {
    const res = await this.repo.findOneBy({
      ...filterQuery,
    });

    if (!res) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    if (res.deleteAt) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return res;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<T>> {
    const queryBuilder = this.repo.createQueryBuilder('entity');
    queryBuilder
      .orderBy('entity.created_at', pageOptionsDto.order)
      .skip(PageOptionsDto.getSkip(pageOptionsDto.page, pageOptionsDto.take))
      .take(pageOptionsDto.take)
      .where('entity.delete_at IS NULL');

    const itemCount = await queryBuilder.getCount(); // This could affect the performance
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async update(filterQuery: FindOptionsWhere<T>, updateDto: Partial<T>) {
    const entity = await this.repo.findOneBy({
      ...filterQuery,
    });
    if (!entity) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    Object.keys(updateDto).forEach((key) => {
      entity[key] = updateDto[key];
    });

    await this.repo.save(entity);
    return entity;
  }

  async delete(filterQuery: FindOptionsWhere<T>) {
    const entity = await this.repo.findOneBy({
      ...filterQuery,
    });

    entity.deleteAt = new Date();
    await this.repo.save(entity);
  }

  async truncate(filterQuery: FindOptionsWhere<T>) {
    await this.repo.delete({
      ...filterQuery,
    });
  }
}
