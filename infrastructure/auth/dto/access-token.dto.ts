import { IsDate, IsObject, IsString } from 'class-validator';

export class AccessTokenDto {
  @IsObject()
  payload: any;

  @IsString()
  sessionToken: string;

  @IsDate()
  expiredAt: Date;
}
