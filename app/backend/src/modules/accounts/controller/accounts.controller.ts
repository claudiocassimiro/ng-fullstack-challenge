import { Controller, Post, Body } from '@nestjs/common';
import { UserDTO } from 'src/modules/users/dto/users.dto';
import { AccountsService } from '../service/accounts.service';
import { CashOutType } from '../types';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('/balance')
  async getBalance(@Body() { accountId }: UserDTO) {
    if (!accountId) {
      throw new Error('Please send the correct values');
    }

    return this.accountsService.getBalance(accountId);
  }

  @Post('/cashout')
  async cashOut(@Body() cashOutObject: CashOutType) {
    const { cashOutUsername, cashInUsername, cashOutAccountId, balance } =
      cashOutObject;
    if (!cashOutUsername || !cashInUsername || !cashOutAccountId || !balance) {
      throw new Error('Please send the correct values');
    }

    if (cashOutUsername === cashInUsername) {
      throw new Error('User cannot transfer to himself');
    }

    return this.accountsService.setCashOut(cashOutObject);
  }
}
