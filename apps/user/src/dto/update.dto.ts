import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sessionToken?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  lastLoggedInTime?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  failedLoginCount?: number;
}
