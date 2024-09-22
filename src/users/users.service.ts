import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create({ email, password, name }: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({ email, password, name });
    return this.usersRepository.save(user);
  }
}
