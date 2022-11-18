import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../service/transactions.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionCashtype } from '../types';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockTransactionsServices = {
    findAllTransactions: jest.fn(() => {
      return [
        {
          id: expect.any(String),
          debidedAccountId: expect.any(String),
          creditedAccountId: expect.any(String),
          value: expect.any(Number),
          createdAt: '2021-02-26T20:42:16.652',
        },
      ];
    }),
    findAllTransactionsByDate: jest.fn(() => {
      return [
        {
          type: expect.any(String),
          id: expect.any(String),
          debidedAccountId: expect.any(String),
          creditedAccountId: expect.any(String),
          value: expect.any(Number),
          createdAt: '2021-02-26T20:42:16.652',
        },
      ];
    }),
    findAllTransactionsByType: jest.fn(() => {
      return [
        {
          type: expect.any(String),
          id: expect.any(String),
          debidedAccountId: expect.any(String),
          creditedAccountId: expect.any(String),
          value: expect.any(Number),
          createdAt: '2021-02-26T20:42:16.652',
        },
      ];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService],
    })
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionsServices)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When try search by', () => {
    it('all transactions, and the correct values is passed, should return an array with the transactions', () => {
      expect(
        controller.findAllTransactions({ accountId: '2345678' }),
      ).resolves.toEqual([
        {
          id: 'valid id',
          debidedAccountId: 'valid debidedAccountId',
          creditedAccountId: 'valid creditedAccountId',
          value: 100,
          createdAt: '2021-02-26T20:42:16.652',
        },
      ]);
    });

    it('all transactions, and a incorrect values is passed, should throw an exception', () => {
      expect(controller.findAllTransactions({ accountId: '' })).rejects.toThrow(
        new HttpException(
          "Please don't send empty fields",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('transactions by date, and the correct values is passed, should return an array with the transactions', () => {
      expect(
        controller.findAllTransactionsByDate({
          accountId: '2345678',
          date: '2021-02-26',
        }),
      ).resolves.toEqual([
        {
          type: 'cashOut',
          id: 'valid id',
          debidedAccountId: 'valid debidedAccountId',
          creditedAccountId: 'valid creditedAccountId',
          value: 100,
          createdAt: '2021-02-26T20:42:16.652',
        },
      ]);
    });

    it('transactions by date, and values is empty, should throw an exception', () => {
      expect(
        controller.findAllTransactionsByDate({ accountId: '', date: '' }),
      ).rejects.toThrow(
        new HttpException(
          "Please don't send empty fields",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('transactions by type, and the correct values is passed, should return an array with the transactions', () => {
      expect(
        controller.findAllTransactionsByType({
          accountId: '2345678',
          type: 'cashOut' as TransactionCashtype.cashOut,
        }),
      ).resolves.toEqual([
        {
          type: 'cashOut',
          id: 'valid id',
          debidedAccountId: 'valid debidedAccountId',
          creditedAccountId: 'valid creditedAccountId',
          value: 100,
          createdAt: '2021-02-26T20:42:16.652',
        },
      ]);
    });

    it('transactions by type, and values is empty, should throw an exception', () => {
      expect(
        controller.findAllTransactionsByType({
          accountId: '',
          type: '' as TransactionCashtype.cashIn,
        }),
      ).rejects.toThrow(
        new HttpException(
          "Please don't send empty fields",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('transactions by type, and value of is type is different than cashOut or cashIn, should throw an exception', () => {
      expect(
        controller.findAllTransactionsByType({
          accountId: '2345678',
          type: 'cashback' as TransactionCashtype.cashIn,
        }),
      ).rejects.toThrow(
        new HttpException(
          'Please send the correct values to type',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
