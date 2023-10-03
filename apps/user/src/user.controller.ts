import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PageOptionsDto } from 'infrastructure/libs/pagination/page-options.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string) {
    return await this.userService.find(id);
  }

  @Get('/findAll')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.userService.findAll(pageOptionsDto);
  }

  @Post('/signUp')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.userService.signUp(signUpDto);
  }

  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.userService.signIn(signInDto);
  }
}
