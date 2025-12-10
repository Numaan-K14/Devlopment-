import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUser } from '../dto/create-user.dto';
import { LoginDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async creatUser(@Body() createUser: createUser) {
    return await this.userService.createUser(createUser);
  }

  @Put('generate-otp')
  async generateOtp(@Body('email') Email: string) {
    return await this.userService.generateOtp(Email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: number) {
    return await this.userService.verifyOtp(email, otp);
  }

  @Put('update-password')
  async UpdatePassword(
    @Body('email') Email: string,
    @Body('password') Password: string,
    @Body('otp') Otp: number,
  ) {
    return this.userService.updatePassword(Email, Password, Otp);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUser: createUser,
  ) {
    return await this.userService.updateUser(userId, updateUser);
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.userService.allUsers(Number(page), Number(limit));
  }

  @Delete('/:id')
  async deleteAssessor(@Param('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @Post('login/')
  async loginUser(@Body() login: LoginDto) {
    return await this.userService.login(login);
  }
}
