import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async signup(body: CreateUserDto) {
    const { email, password } = body;
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // Hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the password along with the salt
    const hashedPassword = (await scrypt(body.password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hashedPassword.toString('hex');

    // Override the plain text password with the hashed one
    body.password = result;

    // Create a new user and save it
    const newUser = await this.usersService.create(body);

    // Return the user
    return newUser;
  }

  async signin(email: string, password: string) {
    // Implement sign in
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hashedPassword.toString('hex')) {
      throw new BadRequestException('Wrong login credentials');
    } else {
      return user;
    }
  }
}
