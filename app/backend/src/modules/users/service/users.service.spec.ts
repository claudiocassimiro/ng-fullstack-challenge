import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../shared/database/prisma.service';
import { BcryptService } from '../../../shared/hash/BcryptService';
import { JWTService } from '../../../shared/jwt/JWTService';
import { UsersService } from './users.service';
import { prismaMock } from './../../../../singleton';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockJWTService = {
    sign: jest.fn(() => '#@#$$332332'),
  };

  const mockBcryptService = {
    hash: jest.fn(() => '#@#$$332332'),
    compare: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        {
          provide: JWTService,
          useValue: mockJWTService,
        },
        {
          provide: BcryptService,
          useValue: mockBcryptService,
        },
      ],
    })
      .overrideProvider(PrismaService)
      // @ts-ignore
      .useValue(mockDeep<PrismaClient>(prismaMock))
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when try created a new user', () => {
    it('the function create is called and the user is save on database, should be returned a text "Successfully registered user"', () => {
      const user = null;

      prismaMock.user.findFirst.mockResolvedValue(user);
      expect(
        service.create({ username: 'Claudio', password: 'Cassimiro1' }),
      ).resolves.toBe('Successfully registered user');
    });

    it('if the function create is called with a existing user, a error should be throw', async () => {
      const user = {
        id: 'mock id',
        username: 'Claudio',
        password: 'Cassimiro1',
        accountId: 'mock accoundId',
      };

      prismaMock.user.findFirst.mockResolvedValue(user);
      expect(
        service.create({ username: 'Claudio', password: 'Cassimiro1' }),
      ).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('when user try make login', () => {
    it('the function login is called with the right params, should be returned a object with token, userId and AccountId', () => {
      const userObject = {
        username: 'Claudio',
        password: 'Cassimiro1',
      };

      const returnedLoginObject = {
        token: '#@#$$332332',
        username: 'Claudio',
        id: 'mock userId',
        accountId: 'mock accountId',
      };

      // @ts-ignore
      prismaMock.user.findFirst.mockResolvedValue(returnedLoginObject);
      expect(service.login(userObject)).resolves.toEqual(returnedLoginObject);
    });

    it('if the user not exist and the function login is called, an error should be throw', () => {
      const userObject = {
        username: 'Claudio',
        password: 'Cassimiro1',
      };

      expect(service.login(userObject)).rejects.toThrow(
        new HttpException('User not exists', HttpStatus.BAD_REQUEST),
      );
    });

    it('if the user exist and the function login is called with wrong password, an error should be throw', () => {
      const userObject = {
        username: 'Claudio',
        password: 'Cassimiro123',
      };

      const user = {
        id: 'mock id',
        username: 'Claudio',
        password: 'Cassimiro1',
        accountId: 'mock accoundId',
      };

      prismaMock.user.findFirst.mockResolvedValue(user);

      mockBcryptService.compare = jest.fn(() => false);

      expect(service.login(userObject)).rejects.toThrow(
        new HttpException('Invalid password', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('get user infos', () => {
    it('when the getUser function is called with an username of a exiting user, shoud be returned a user object', () => {
      const user = {
        id: 'mock id',
        username: 'Claudio',
        password: 'Cassimiro1',
        accountId: 'mock accoundId',
      };

      prismaMock.user.findFirst.mockResolvedValue(user);

      expect(service.getUser('Claudio')).resolves.toEqual(user);
    });

    it('when the getUser function is called with a username of a non-existent user, shoud be returned null', () => {
      const user = null;

      prismaMock.user.findFirst.mockResolvedValue(user);

      expect(service.getUser('Paulo')).resolves.toEqual(null);
    });
  });
});
