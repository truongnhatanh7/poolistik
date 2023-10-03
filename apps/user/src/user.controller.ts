import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PageOptionsDto } from 'infrastructure/libs/pagination/page-options.dto';

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
}
