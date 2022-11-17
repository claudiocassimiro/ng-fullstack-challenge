import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { accountDTO } from '../dto/accounts.dto';
import { AccountsService } from '../service/accounts.service';
import { CashOutType } from '../types';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('/balance')
  @HttpCode(200)
  async getBalance(@Body() { id }: accountDTO) {
    if (!id) {
      throw new HttpException(
        'Please send the correct values',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.accountsService.getBalance(id);
  }

  @Post('/cashout')
  @HttpCode(200)
  async cashOut(@Body() cashOutObject: CashOutType) {
    const { cashOutUsername, cashInUsername, cashOutAccountId, balance } =
      cashOutObject;
    if (!cashOutUsername || !cashInUsername || !cashOutAccountId || !balance) {
      throw new HttpException(
        'Please send the correct values',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (cashOutUsername === cashInUsername) {
      throw new HttpException(
        'User cannot transfer to himself',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.accountsService.setCashOut(cashOutObject);
  }
}
