import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataMapper } from 'apps/user/src/entities/user.mapper';
import { Repository } from 'typeorm';
import { UserEntity } from 'apps/user/src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDomain } from 'apps/user/src/entities/user.domain';

@Injectable()
export class AuthService {
  private userDataMapper: UserDataMapper;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.userDataMapper = new UserDataMapper();
  }
  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const newUser = new UserDomain();
    newUser.username = signUpDto.username;
    newUser.password = hashedPassword;

    const userEntity = this.userDataMapper.toOrmEntity(newUser);
    await this.userRepo.save(userEntity);
    // TODO: return jwt
  }

  async signIn(signInDto: SignInDto) {
    // Find user by user name
    const user = await this.findByUsername(signInDto.username);
    if (!user) {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }

    const pwdCmp = await bcrypt.compare(signInDto.password, user.password);
    if (!pwdCmp) {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }

    // Check login failed count

    // Generate token pair: refresh token and access token

    // Save generated token to db

    // return token
    return 'yasuo';
  }

  private async findByUsername(username: string) {
    return this.userRepo.findOneBy({
      username: username,
    });
  }
}
