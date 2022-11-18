import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { PrismaService } from '../../shared/database/prisma.service';
import { BcryptService } from '../../shared/hash/BcryptService';
import { JWTService } from '../../shared/jwt/JWTService';
import { AccountsService } from '../accounts/service/accounts.service';
import { TransactionsService } from '../transactions/service/transactions.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    BcryptService,
    JWTService,
    AccountsService,
    TransactionsService,
  ],
})
export class UsersModule {}
