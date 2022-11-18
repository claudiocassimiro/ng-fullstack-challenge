import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from '../service/accounts.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AccountsController', () => {
  let controller: AccountsController;

  const mockAccountsServices = {
    getBalance: jest.fn(() => {
      return expect.any(Number);
    }),
    setCashOut: jest.fn(() => 'Successful transfer'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [AccountsService],
    })
      .overrideProvider(AccountsService)
      .useValue(mockAccountsServices)
      .compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when the user try get the account balance', () => {
    it('if the correct value is passed, should return the balance of user account', () => {
      expect(controller.getBalance('2345678')).resolves.toEqual(100);
    });

    it('if the value passed is empty, should throw an exception', () => {
      expect(controller.getBalance('')).rejects.toThrow(
        new HttpException(
          "Please don't pass empty fields",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('when the user try make a cashOut', () => {
    const cashOutObj = {
      cashOutUsername: 'mock cashOut username',
      cashOutAccountId: 'mock accountId',
      cashInUsername: 'mock cashIn username',
      balance: 7000,
    };

    it('if the correct value is passed, should return the message "Successful transfer"', () => {
      expect(controller.setCashOut(cashOutObj)).resolves.toEqual(
        'Successful transfer',
      );
    });

    it('if the values passed is empty, should throw an exception', () => {
      const cashOutObj = {
        cashOutUsername: '',
        cashOutAccountId: '',
        cashInUsername: '',
        balance: undefined,
      };

      expect(controller.setCashOut(cashOutObj)).rejects.toThrow(
        new HttpException(
          "Please don't pass empty fields",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('if the values is passed is, but cashOutUsername is equal to cashInUsername, should throw an exception', () => {
      const cashOutObj = {
        cashOutUsername: 'mock cashOut username',
        cashOutAccountId: 'mock accountId',
        cashInUsername: 'mock cashOut username',
        balance: 7000,
      };

      expect(controller.setCashOut(cashOutObj)).rejects.toThrow(
        new HttpException(
          'User cannot transfer to himself',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
