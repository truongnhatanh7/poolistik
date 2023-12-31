import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'infrastructure/auth/guard/auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ResetPasswordReqDto } from './dto/reset-password.req.dto';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Req() req: Request, @Body() signInDto: SignInDto) {
    return await this.authService.signIn(req, signInDto);
  }

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/refresh-token')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async refreshToken(@Req() req: Request) {
    return await this.authService.handleRefreshToken(req);
  }

  @Post('/sign-out')
  async signOut() {}

  @Get('/heathcheck')
  healthCheck() {
    return this.authService.healthCheck();
  }

  @Get('/guard-test')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  guardTest() {
    return true;
  }

  @Put('/forgot-password/:id')
  async forgotPassword(@Param('id') id: string) {
    return await this.authService.forgotPassword(id);
  }

  @Put('/reset-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordReqDto,
  ) {
    return await this.authService.resetPassword(id, resetPasswordDto);
  }
}
