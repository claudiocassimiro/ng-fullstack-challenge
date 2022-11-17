import { Controller, Post, Body } from '@nestjs/common';
import { UserDTO } from 'src/modules/users/dto/users.dto';
import { AccountsService } from '../service/accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('/balance')
  async getBalance(@Body() { accountId }: UserDTO) {
    return this.accountsService.getBalance(accountId);
  }
}
