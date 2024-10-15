import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { before } from 'node:test';

describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (body: CreateUserDto) =>
        Promise.resolve({ id: 1, ...body } as User),
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
    authService = module.get<AuthService>(AuthService);
  });

  it('can create the instance of the auth service', async () => {
    expect(authService).toBeDefined();
  });
  it('creates a new user with a salted and hashed password', async () => {
    const user = await authService.signup({
      email: 'someemail@gmail.com',
      password: 'password',
      name: 'name',
    });
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
});
