import { Module } from '@nestjs/common';
import { AccountsService } from './service/accounts.service';
import { AccountsController } from './controller/accounts.controller';
import { PrismaService } from '../../shared/database/prisma.service';
import { UsersService } from '../users/service/users.service';
import { BcryptService } from '../../shared/hash/BcryptService';
import { JWTService } from '../../shared/jwt/JWTService';
import { TransactionsService } from '../transactions/service/transactions.service';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    PrismaService,
    UsersService,
    TransactionsService,
    BcryptService,
    JWTService,
  ],
})
export class AccountsModule {}
