import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsEmail()
  @IsOptional()
  email?: string;

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
