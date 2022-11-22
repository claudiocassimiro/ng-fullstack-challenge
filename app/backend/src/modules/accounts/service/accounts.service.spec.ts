import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { prismaMock } from './../../../../singleton';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../shared/database/prisma.service';
import { UsersService } from '../../users/service/users.service';
import { TransactionsService } from '../../transactions/service/transactions.service';
import { JWTService } from '../../../shared/jwt/JWTService';
import { BcryptService } from '../../../shared/hash/BcryptService';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;

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
        AccountsService,
        PrismaService,
        UsersService,
        TransactionsService,
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

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when try created account', () => {
    it('the function create is called and the account is create on database', () => {
      const dataToCreateAccount = {
        id: '123',
        balance: 100,
      };

      prismaMock.account.create.mockResolvedValue(dataToCreateAccount);
      expect(service.create(dataToCreateAccount)).resolves.toEqual(
        dataToCreateAccount,
      );
    });
  });

  describe('the user can take the balance of an account', () => {
    it('when the function getBalance is called with the accountId, should be retuned the balance of account', () => {
      const accountId = '123';
      const returnedObject = {
        id: accountId,
        balance: 100,
      };

      prismaMock.account.findFirst.mockResolvedValue(returnedObject);

      expect(service.getBalance(accountId)).resolves.toEqual({ balance: 100 });
    });
  });

  describe('the user can make aa cashOut to another user', () => {
    it('if has balance on account and the function setCashOut is called with the rights params, should be retuned "Successful transfer"', () => {
      const accountId = '123';

      const returnedObject = {
        id: accountId,
        balance: 150,
      };

      const passedObject = {
        cashOutUsername: 'Milena',
        cashOutAccountId: accountId,
        cashInUsername: 'Claudio',
        balance: 100,
      };

      const userObject = {
        token: '#@#$$332332',
        id: 'mock userId',
        accountId: 'mock accountId',
        username: 'Claudio',
        password: '234',
      };

      prismaMock.account.findFirst.mockResolvedValue(returnedObject);
      prismaMock.user.findFirst.mockResolvedValue(userObject);

      expect(service.setCashOut(passedObject)).resolves.toEqual({
        message: 'Successful transfer',
      });
    });

    it('if has no balance on account and the function setCashOut is called with the rights params, should be throw an error "Insuficient balance"', () => {
      const accountId = '123';

      const returnedObject = {
        id: accountId,
        balance: 90,
      };

      const passedObject = {
        cashOutUsername: 'Milena',
        cashOutAccountId: accountId,
        cashInUsername: 'Claudio',
        balance: 100,
      };

      prismaMock.account.findFirst.mockResolvedValue(returnedObject);

      expect(service.setCashOut(passedObject)).rejects.toThrow(
        new HttpException('Insuficient balance', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
