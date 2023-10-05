import { IsDate, IsObject, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsObject()
  payload: any;

  @IsString()
  sessionToken: string;

  @IsDate()
  expiredAt: Date;
}
