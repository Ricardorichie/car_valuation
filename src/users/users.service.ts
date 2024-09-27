import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(body: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(body); // always create the entity instance before saving
    return this.usersRepository.save<User>(user);
  }

  async findOne(id: number): Promise<User> {
    const user = this.usersRepository.findOne({
      where: { id },
    });
    return user;
  }

  async find(email: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: { email },
    });
    if (!users.length) {
      throw new Error('User not found');
    }
    return users;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.remove(user);
  }

  async update(id: number, attrs: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }
}
