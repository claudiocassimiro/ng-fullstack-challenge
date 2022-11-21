import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { accountDTO } from '../dto/accounts.dto';
import { PrismaService } from '../../../shared/database/prisma.service';
import { CashOutType } from '../types';
import { UsersService } from '../../users/service/users.service';
import { TransactionsService } from '../../../modules/transactions/service/transactions.service';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private transactionsService: TransactionsService,
  ) {}
  async create(data: accountDTO) {
    try {
      const { id, balance } = data;

      return this.prisma.account.create({
        data: {
          id,
          balance,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBalance(accountId: string) {
    try {
      const { balance } = await this.prisma.account.findFirst({
        where: {
          id: accountId,
        },
      });

      return { balance };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async setCashOut({ cashOutAccountId, cashInUsername, balance }: CashOutType) {
    try {
      const userCheckOutBalance = await this.getBalance(cashOutAccountId);

      if (balance > userCheckOutBalance.balance) {
        throw new HttpException('Insuficient balance', HttpStatus.BAD_REQUEST);
      }

      const updateUserCheckOutBalance = this.prisma.account.update({
        where: {
          id: cashOutAccountId,
        },
        data: {
          balance: { decrement: balance },
        },
      });

      const { accountId: userCheckInAccountId } =
        await this.usersService.getUser(cashInUsername);

      const updateUserCheckInBalance = this.prisma.account.update({
        where: {
          id: userCheckInAccountId,
        },
        data: {
          balance: { increment: balance },
        },
      });

      await this.prisma.$transaction([
        updateUserCheckOutBalance,
        updateUserCheckInBalance,
      ]);

      await this.transactionsService.create({
        debitedAccountId: cashOutAccountId,
        creditedAccountId: userCheckInAccountId,
        value: balance,
      });

      return { message: 'Successful transfer' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
