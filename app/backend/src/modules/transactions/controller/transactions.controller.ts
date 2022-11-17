import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { Transactions, TransactionsByDate, TransactionsByType } from '../types';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/all')
  @HttpCode(200)
  async findAllTransactions(@Body() { accountId }: Transactions) {
    if (!accountId) {
      throw new Error('Please send the correct values');
    }

    return await this.transactionsService.findAllTransactions(accountId);
  }

  @Post('/bydate')
  @HttpCode(200)
  async findAllTransactionsByDate(
    @Body() { accountId, date }: TransactionsByDate,
  ) {
    if (!accountId || !date) {
      throw new HttpException(
        'Please send the correct values',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.transactionsService.findAllTransactionsByDate({
      accountId,
      date,
    });
  }

  @Post('/bytype')
  @HttpCode(200)
  async findAllTransactionsByType(
    @Body() { accountId, type }: TransactionsByType,
  ) {
    if (!accountId || !type) {
      throw new HttpException(
        'Please send the correct values',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (type !== `cashOut` && type !== `cashIn`) {
      throw new HttpException(
        'Please send the correct values to type',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.transactionsService.findAllTransactionsByType({
      accountId,
      type,
    });
  }
}
