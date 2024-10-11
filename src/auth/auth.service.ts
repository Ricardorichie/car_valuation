import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

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
    const users = await this.usersRepository.find({
      where: { email },
    });
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

  async signin() {
    // Implement sign in
  }
}
