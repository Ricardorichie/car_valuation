import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UsersService } from '../../src/users/users.service';
import { UsersModule } from '../../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  it('can be instantiated', async () => {
    const fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (body: CreateUserDto) => Promise.resolve({ id: 1, ...body }),
    };
    // Mock the UserRepository as well
    const fakeUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          // Mock the UserRepository using getRepositoryToken
          provide: getRepositoryToken(User),
          useValue: fakeUserRepository,
        },
      ],
    }).compile();
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });
});
