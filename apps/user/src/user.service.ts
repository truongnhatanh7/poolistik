import { Injectable } from '@nestjs/common';
import { UserDataMapper } from './entities/user.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private userDataMapper: UserDataMapper;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.userDataMapper = new UserDataMapper();
  }

  getHello(): string {
    return 'Hello World!';
  }

  find() {
    return this.userRepo.findOneBy({
      id: '550e8400-e29b-41d4-a716-446655440000',
    });
  }
}
