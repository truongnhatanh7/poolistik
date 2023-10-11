import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordReqDto {
  @ApiProperty()
  resetToken: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmNewPassword: string;
}
