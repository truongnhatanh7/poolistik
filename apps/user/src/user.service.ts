import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'infrastructure/libs/pagination/page-options.dto';
import { PageDto } from 'infrastructure/libs/pagination/page.dto';
import { PageMetaDto } from 'infrastructure/libs/pagination/page.meta';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDataMapper } from './entities/user.mapper';

@Injectable()
export class UserService {
  private userDataMapper: UserDataMapper;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.userDataMapper = new UserDataMapper();
  }

  async find(id: string) {
    const user: UserEntity = await this.userRepo.findOneBy({
      id: id,
    });
    return this.userDataMapper.toDomainEntity(user);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.userRepo.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.created_at', pageOptionsDto.order)
      .skip(PageOptionsDto.getSkip(pageOptionsDto.page, pageOptionsDto.take))
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
