import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersServices = {
    create: jest.fn(() => 'Successfully registered user'),
    login: jest.fn(() => {
      return {
        token: expect.any(String),
        id: expect.any(String),
        accountId: expect.any(String),
      };
    }),
    getUsernameByAccountId: jest.fn(() => {
      return { username: 'Milena' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersServices)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when try create a user', () => {
    it('When pass the correct values to create a user, the user should be created', () => {
      expect(
        controller.create({ username: 'Claudio', password: 'Cassimiro1' }),
      ).resolves.toBe('Successfully registered user');
    });

    it("When pass incorrect value of username to create a user, the user should't be created", () => {
      expect(
        controller.create({ username: 'Cl', password: 'Cassimiro1' }),
      ).rejects.toThrow(
        new HttpException('Username too short', HttpStatus.BAD_REQUEST),
      );
    });

    it("When pass incorrect value of password to create a user, the user should't be created", () => {
      expect(
        controller.create({ username: 'Claudio', password: 'Cassimiro' }),
      ).rejects.toThrow(
        new HttpException('Password too weak', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('when try login', () => {
    it('if the credentials is right, the user can be logged', () => {
      expect(
        controller.login({ username: 'Claudio', password: 'Cassimiro1' }),
      ).resolves.toEqual({
        token: 'valid token',
        id: 'valid id',
        accountId: 'valid accoundId',
      });
    });

    it("if the credentials is not passed, the user can't logged", () => {
      expect(controller.login({ username: '', password: '' })).rejects.toThrow(
        new HttpException(
          "Please don't send empty fields",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('when try get username', () => {
    it('if the accountId is passed, the router return username of passed accountId', () => {
      expect(
        controller.getUsernameByAccountId({ accountId: 'mock accountId' }),
      ).resolves.toEqual({
        username: 'Milena',
      });
    });

    it("if the credentials is not passed, the user can't logged", () => {
      expect(
        controller.getUsernameByAccountId({ accountId: '' }),
      ).rejects.toThrow(
        new HttpException(
          "Please don't send empty fields",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
