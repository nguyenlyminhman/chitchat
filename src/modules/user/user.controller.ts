import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'src/common/response';
import { CreateUserDto } from './dtos/create.user.dto';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @Post("/new")
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() user: CreateUserDto) {
    const data = await this.userService.createUser(user);
    return new Response(HttpStatus.OK, "OK, putted", data);
  }

  @Get("/one")
  @HttpCode(HttpStatus.OK)
  async getUser() {
    const data = await this.userService.getUserById();
    return new Response(HttpStatus.OK, "OK, got it", data);
  }

  @Put("/put-update")
  @HttpCode(HttpStatus.OK)
  async updateUser() {
    const data = await this.userService.updateUserById();
    return new Response(HttpStatus.OK, "OK, updated it", data);
  }
}
