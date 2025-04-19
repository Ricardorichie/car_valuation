import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  //custom decorator
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  @Serialize(UserDto)
  async signupUser(@Body() body: CreateUserDto, @Session() session: any) {
    // console.log('body', body);
    const user = await this.authService.signup(body);
    session.userId = user.id;
    // remove password from the user object
    return user;
  }

  @Post('/signin')
  async loginUser(
    @Body() body: { email: string; password: string },
    @Session() session: any,
  ) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }
}
