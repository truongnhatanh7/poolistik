import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  resetToken: string;
}
