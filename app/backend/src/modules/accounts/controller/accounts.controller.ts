import { Controller } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
}
