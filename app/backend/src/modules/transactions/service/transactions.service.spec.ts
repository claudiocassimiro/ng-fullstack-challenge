import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../../shared/database/prisma.service';
import { prismaMock } from './../../../../singleton';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient, User } from '@prisma/client';
import { TransactionCashtype } from '../types';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      // @ts-ignore
      .useValue(mockDeep<PrismaClient>(prismaMock))
      .compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create a transaction', () => {
    it('when the create function is called, should be returned a transaction object', async () => {
      const date = new Date();
      const transactionsObjectToBeCreated = {
        id: '123',
        debitedAccountId: 'mock debitedAccountId',
        creditedAccountId: 'mock creditedAccountId',
        value: 100,
        createdAt: date,
      };

      const transactions = {
        id: '123',
        debitedAccountId: 'mock debitedAccountId',
        creditedAccountId: 'mock creditedAccountId',
        value: 100,
        createdAt: date,
      };

      prismaMock.transaction.create.mockResolvedValue(
        transactionsObjectToBeCreated,
      );

      expect(service.create(transactions)).resolves.toEqual(
        transactionsObjectToBeCreated,
      );
    });
  });

  describe('find transactions', () => {
    it('the function findAllTransactions, should return all transactions', async () => {
      const date = new Date();
      const transactions = [
        {
          id: '123',
          type: 'cashOut',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 100,
          createdAt: date,
        },
        {
          id: '1234',
          type: 'cashOut',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 140,
          createdAt: date,
        },
        {
          id: '1235',
          type: 'cashOut',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 150,
          createdAt: date,
        },
      ];

      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      prismaMock.user.findFirst.mockResolvedValue({
        username: 'mock username',
      } as User);

      expect(
        await service.findAllTransactions('mock debitedAccountId'),
      ).toEqual(transactions);
    });

    it('the function findAllTransactionsByDate, should return all transactions that equal to date passed by params', async () => {
      const date = new Date('2022-11-18');
      const differentDate = new Date('2022-11-16');
      const transactions = [
        {
          type: 'cashOut',
          id: '123',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 100,
          createdAt: date,
        },
        {
          type: 'cashOut',
          id: '1234',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 140,
          createdAt: date,
        },
        {
          type: 'cashOut',
          id: '1235',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 150,
          createdAt: differentDate,
        },
      ];

      prismaMock.transaction.findMany.mockResolvedValue([
        transactions[0],
        transactions[1],
      ]);

      prismaMock.user.findFirst.mockResolvedValue({
        username: 'mock username',
      } as User);

      expect(
        await service.findAllTransactionsByDate({
          accountId: 'mock debitedAccountId',
          date: '2022-11-18',
        }),
      ).toEqual([transactions[0], transactions[1]]);
    });

    it('the function findAllTransactionsByDate, should return all transactions that equal to date and the type should be cashIn', async () => {
      const date = new Date('2022-11-18');
      const transactions = [
        {
          type: 'cashIn',
          id: '123',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 100,
          createdAt: date,
        },
        {
          type: 'cashIn',
          id: '1234',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 140,
          createdAt: date,
        },
        {
          type: 'cashIn',
          id: '1235',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 150,
          createdAt: date,
        },
      ];

      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      prismaMock.user.findFirst.mockResolvedValue({
        username: 'mock username',
      } as User);

      expect(
        await service.findAllTransactionsByDate({
          accountId: 'mock creditedAccountId',
          date: '2022-11-18',
        }),
      ).toEqual(transactions);
    });

    it('the function findAllTransactionsByType, should return all transactions that equal to type passed by params "cashOut"', async () => {
      const date = new Date('2022-11-18');
      const transactions = [
        {
          type: 'cashOut',
          id: '123',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 100,
          createdAt: date,
        },
        {
          type: 'cashOut',
          id: '1234',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 140,
          createdAt: date,
        },
        {
          type: 'cashOut',
          id: '1235',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 150,
          createdAt: date,
        },
      ];

      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      prismaMock.user.findFirst.mockResolvedValue({
        username: 'mock username',
      } as User);

      expect(
        await service.findAllTransactionsByType({
          accountId: 'mock debitedAccountId',
          type: 'cashOut' as TransactionCashtype.cashOut,
        }),
      ).toEqual(transactions);
    });

    it('the function findAllTransactionsByType, should return all transactions that equal to type passed by params "cashIn"', async () => {
      const date = new Date('2022-11-18');
      const transactions = [
        {
          type: 'cashOut',
          id: '123',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 100,
          createdAt: date,
        },
        {
          type: 'cashIn',
          id: '1234',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 140,
          createdAt: date,
        },
        {
          type: 'cashIn',
          id: '1235',
          debitedAccountId: 'mock debitedAccountId',
          creditedAccountId: 'mock creditedAccountId',
          username: 'mock username',
          value: 150,
          createdAt: date,
        },
      ];

      prismaMock.transaction.findMany.mockResolvedValue([
        transactions[1],
        transactions[2],
      ]);

      prismaMock.user.findFirst.mockResolvedValue({
        username: 'mock username',
      } as User);

      expect(
        await service.findAllTransactionsByType({
          accountId: 'mock debitedAccountId',
          type: 'cashIn' as TransactionCashtype.cashIn,
        }),
      ).toEqual([transactions[1], transactions[2]]);
    });
  });
});
