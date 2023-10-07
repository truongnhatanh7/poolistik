import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { PageOptionsDto } from 'infrastructure/libs/pagination/page-options.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.find(id);
  }

  @Get('/findAll')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.userService.findAll(pageOptionsDto);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }

  @Delete('/truncate/:id')
  @HttpCode(HttpStatus.OK)
  async truncate(@Param('id') id: string) {
    return await this.userService.truncate(id);
  }

  @Get('/healthcheck')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return this.userService.healthCheck();
  }
}
