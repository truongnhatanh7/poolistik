import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'infrastructure/libs/pagination/page-options.dto';
import { PageDto } from 'infrastructure/libs/pagination/page.dto';
import { PageMetaDto } from 'infrastructure/libs/pagination/page.meta';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDataMapper } from './entities/user.mapper';
import { UserDomain } from './entities/user.domain';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private userDataMapper: UserDataMapper;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.userDataMapper = new UserDataMapper();
  }

  async find(id: string): Promise<UserDomain> {
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
    const resultEntities = entities.map((e) => {
      return this.userDataMapper.toDomainEntity(e);
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(resultEntities, pageMetaDto);
  }

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const newUser = new UserDomain();
    newUser.username = signUpDto.username;
    newUser.password = hashedPassword;

    const userEntity = this.userDataMapper.toOrmEntity(newUser);
    console.log(userEntity);

    await this.userRepo.save(userEntity);
    // TODO: return jwt
  }
}
