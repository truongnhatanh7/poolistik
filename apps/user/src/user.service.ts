import { Inject, Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'infrastructure/libs/pagination/page-options.dto';
import { PageDto } from 'infrastructure/libs/pagination/page.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserDomain } from './entities/user.domain';
import { UserDataMapper } from './entities/user.mapper';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
  private userDataMapper: UserDataMapper;
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {
    this.userDataMapper = new UserDataMapper();
  }

  async find(id: string): Promise<UserDomain> {
    const user = await this.userRepository.findOne({
      id: id,
    });
    return this.userDataMapper.toDomainEntity(user);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDomain>> {
    const queryResult = await this.userRepository.findAll(pageOptionsDto);
    const modifiedData = queryResult.data.map((e) => {
      return this.userDataMapper.toDomainEntity(e);
    });
    return new PageDto(modifiedData, queryResult.meta);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update({ id: id }, updateUserDto);
    return this.userDataMapper.toDomainEntity(user);
  }

  async delete(id: string) {
    await this.userRepository.delete({ id: id });
  }

  async truncate(id: string) {
    await this.userRepository.truncate({ id: id });
  }

  healthCheck() {
    return true;
  }
}
