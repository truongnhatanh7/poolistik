import {
  CanActivate,
  ExecutionContext,
  Inject,
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
import { Reflector } from '@nestjs/core';
import { UserRole } from '../role/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
      this.verifyRole(payload, context);
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

  private verifyRole(payload: AccessTokenDto, context: ExecutionContext) {
    if (!payload.payload.hasOwnProperty('userId')) {
      throw new UnauthorizedException();
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return;
    }

    if (!payload.payload.hasOwnProperty('role')) {
      throw new UnauthorizedException();
    }

    if (payload.payload.role != requiredRoles) {
      throw new UnauthorizedException();
    }
  }

  private async verifySessionToken(payload: AccessTokenDto) {
    if (!payload.payload.hasOwnProperty('userId')) {
      throw new UnauthorizedException();
    }
    const userId: string = payload.payload.userId;
    const sessionToken = payload.sessionToken;

    // Check cache
    const cachedSessionToken = await this.cacheService.get(
      `session_token_${userId}`,
    );

    if (cachedSessionToken && cachedSessionToken === sessionToken) {
      return;
    }

    if (cachedSessionToken && cachedSessionToken !== sessionToken) {
      throw new UnauthorizedException();
    }

    const getUserApi = `${this.configService.get<string>(
      'USER_SERVICE_ENDPOINT',
    )}/api/find/${userId}`;

    const res = await lastValueFrom(
      this.httpService.get<UserDomain>(getUserApi),
    );

    if (res.data.sessionToken !== sessionToken) {
      throw new UnauthorizedException();
    }

    await this.cacheService.set(
      `session_token_${res.data.id}`,
      res.data.sessionToken,
    );
  }
}
