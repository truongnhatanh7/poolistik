import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessTokenDto } from '../dto/access-token.dto';
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
      await this.verifySessionToken(payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = JSON.stringify(payload);
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
    if (!payload.payload.hasOwnProperty('userId')) {
      throw new UnauthorizedException();
    }
    const userId: string = payload.payload.userId;
    const sessionToken = payload.sessionToken;

    const getUserApi = `${this.configService.get<string>(
      'USER_SERVICE_ENDPOINT',
    )}/api/find/${userId}`;

    await lastValueFrom(this.httpService.get<UserDomain>(getUserApi)).then(
      (data) => {
        if (data.data.sessionToken !== sessionToken) {
          throw new UnauthorizedException();
        }
      },
    );
  }
}
