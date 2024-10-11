import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signupUser(@Body() body: CreateUserDto) {
    // console.log('body', body);
    return this.authService.signup(body);
  }

  @Post('/signin')
  loginUser(@Body() body: { email: string; password: string }) {
    return this.authService.signin(body.email, body.password);
  }
}
