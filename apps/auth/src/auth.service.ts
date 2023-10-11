import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'apps/user/src/dto/update.dto';
import { UserDomain } from 'apps/user/src/entities/user.domain';
import { UserEntity } from 'apps/user/src/entities/user.entity';
import { UserDataMapper } from 'apps/user/src/entities/user.mapper';
import { AxiosError } from 'axios';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from 'infrastructure/auth/dto/refresh-token.dto';
import { ReturnToken } from 'infrastructure/auth/dto/return-token.dto';
import { UserRole } from 'infrastructure/auth/role/role.enum';
import { NodeMailerService } from 'infrastructure/mail/mail.service';
import { catchError, lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { AccessTokenDto } from '../../../infrastructure/auth/dto/access-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Cache } from 'cache-manager';
import Mail from 'nodemailer/lib/mailer';
import { ResetPasswordReqDto } from './dto/reset-password.req.dto';
import { RESET_PREFIX } from './constants/caching';
import { ResetPasswordResDto } from './dto/reset-password.res.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  private userDataMapper: UserDataMapper;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private httpService: HttpService,
    private mailService: NodeMailerService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    this.userDataMapper = new UserDataMapper();
  }
  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const newUser = new UserDomain();
    newUser.username = signUpDto.username;
    newUser.password = hashedPassword;
    newUser.email = signUpDto.email;
    newUser.role = UserRole.User;

    const userEntity = this.userDataMapper.toOrmEntity(newUser);
    await this.userRepo.save(userEntity);

    // TODO: Return success msg, force client to log-in
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
    if (user.failedLoginCount > 5) {
      // TODO: Handle block account
      throw new HttpException('BadRequest', HttpStatus.UNAUTHORIZED);
    }

    // Generate token pair: refresh token and access token
    const returnTokens = await this.generateToken(
      hashSessionToken,
      user.id,
      signInDto.username,
      user.role,
    );
    // Save session token to db
    await this.persistSessionToken(user.id, hashSessionToken);
    // return token
    return returnTokens;
  }

  private async generateToken(
    hashSessionToken: string,
    userId: string,
    username: string,
    role: UserRole,
  ): Promise<ReturnToken> {
    const accessTokenPayload: AccessTokenDto = {
      payload: {
        userId: userId,
        username: username,
        role: role,
      },
      sessionToken: hashSessionToken,
      expiredAt: new Date(new Date().getTime() + 360000), // 1 hour
    };

    const refreshTokenPayload: RefreshTokenDto = {
      payload: {
        userId: userId,
        username: username,
        role: role,
      },
      sessionToken: hashSessionToken,
      expiredAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // TODO: refactor to DTO, add expire time
    const accessToken = await this.jwtService.signAsync(accessTokenPayload);
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload);

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

  private async persistSessionToken(userId: string, sessionToken: string) {
    const updateUserApi = `${this.configService.get<string>(
      'USER_SERVICE_ENDPOINT',
    )}/api/update/${userId}`;

    const updatePayload: UpdateUserDto = new UpdateUserDto();
    updatePayload.sessionToken = sessionToken;

    const res = await lastValueFrom(
      this.httpService.put(updateUserApi, updatePayload).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }),
      ),
    );
    return res;
  }

  healthCheck() {
    return true;
  }

  async handleRefreshToken(req: Request) {
    // Generate token pair: refresh token and access token
    const payload: AccessTokenDto = JSON.parse(req['user']);
    if (!payload || payload === undefined || payload === null) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const returnTokens = await this.generateToken(
      payload.sessionToken,
      payload.payload?.userId,
      payload.payload?.username,
      payload.payload?.role,
    );

    // Save session token to db
    await this.persistSessionToken(
      payload.payload?.userId,
      payload.sessionToken,
    );
    // return token
    return returnTokens;
  }

  async forgotPassword(id: string): Promise<ResetPasswordResDto> {
    const user = await this.userRepo.findOneBy({
      id: id,
    });

    if (!user) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    // FE has to implement reset password form
    const mailOptions: Mail.Options = {
      to: user.email,
      subject: 'Reset Password',
      text: `Use this link to reset your password <link>`,
    };
    await this.mailService.send(mailOptions);

    // Set temporary reset token to Redis
    const resetToken = Math.floor(Math.random() * Date.now()).toString(36);
    const hashResetToken = await bcrypt.hash(resetToken, 10);
    await this.cacheService.set(
      `${RESET_PREFIX}_${id}`,
      hashResetToken,
      60 * 3, // 3 minutes
    );

    return {
      id: id,
      resetToken: hashResetToken,
    };
  }

  async resetPassword(id: string, resetPasswordDto: ResetPasswordReqDto) {
    // Check valid token?, if valid, remove from Redis else throw err
    const resetToken = await this.cacheService.get<string>(
      `${RESET_PREFIX}_${id}`,
    );

    if (!bcrypt.compare(resetPasswordDto.resetToken, resetToken)) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    // Find user
    const user = await this.userRepo.findOneBy({ id: id });
    // Update user pwd
    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.userRepo.save(user);

    // Remove reset token
    await this.cacheService.del(`${RESET_PREFIX}_${id}`);
  }
}
