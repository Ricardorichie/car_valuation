import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { create } from 'domain';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth') //changed from 'users' to 'auth' to create a new path for authentication
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    console.log('body', body);
    return this.usersService.create(body);
  }
}
