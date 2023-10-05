import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessTokenDto } from '../../../apps/auth/src/dto/access-token.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UserDomain } from 'apps/user/src/entities/user.domain';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: AccessTokenDto = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      this.verifyExpiredToken(payload);
      // await this.verifySessionToken(payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private verifyExpiredToken(payload: AccessTokenDto) {
    const expiredDate = new Date(payload.expiredAt);
    if (new Date() > expiredDate) {
      throw new UnauthorizedException();
    }
  }

  private async verifySessionToken(payload: AccessTokenDto) {
    if (!payload.payload.userId) {
      throw new UnauthorizedException();
    }
    const userId: string = payload.payload.userId;
    const sessionToken = payload.sessionToken;
    const host = this.configService.get<string>('HOST_NAME');
    const userServicePort = this.configService.get<string>('USER_SERVICE_PORT');
    const getUserApi = host + ':' + userServicePort + '/api/find/' + userId;

    const res = await lastValueFrom(this.httpService.get(getUserApi));

    if (!(res instanceof UserDomain)) {
      throw new UnauthorizedException();
    }

    if ((res as UserDomain).sessionToken !== sessionToken) {
      throw new UnauthorizedException();
    }
  }
}
