import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataMapper } from 'apps/user/src/entities/user.mapper';
import { Repository } from 'typeorm';
import { UserEntity } from 'apps/user/src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDomain } from 'apps/user/src/entities/user.domain';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private userDataMapper: UserDataMapper;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
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

  async signIn(req: Request, signInDto: SignInDto) {
    // Find user by user name
    const user = await this.findByUsername(signInDto.username);
    if (!user) {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }

    const pwdCmp = await bcrypt.compare(signInDto.password, user.password);
    if (!pwdCmp) {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }

    const sessionToken = req.headers['user-agent'];
    if (!sessionToken) {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }
    const hashSessionToken = await bcrypt.hash(sessionToken, 10);

    // Check login failed count

    // Generate token pair: refresh token and access token
    const returnTokens = this.generateToken(
      hashSessionToken,
      user.id,
      signInDto.username,
    );
    // Save generated token to db

    // return token
    return returnTokens;
  }

  private async generateToken(ua: string, userId: string, username: string) {
    const userPayload = {
      userId: userId,
      username: username,
      sessionToken: ua,
    };

    // TODO: refactor to DTO, add expire time

    const accessToken = await this.jwtService.signAsync(userPayload);
    const refreshToken = await this.jwtService.signAsync({
      userId: userId,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async findByUsername(username: string) {
    return this.userRepo.findOneBy({
      username: username,
    });
  }
}
