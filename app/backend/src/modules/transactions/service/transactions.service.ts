import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { randomUUID } from 'crypto';
import { TransactionsDTO } from '../dto/transactions.dto';
import { TransactionsByDate, TransactionsByType } from '../types';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: TransactionsDTO) {
    try {
      const id = randomUUID();

      return this.prisma.transaction.create({ data: { id, ...data } });
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async findAllTransactions(accountId: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          OR: [
            { debitedAccountId: accountId },
            { creditedAccountId: accountId },
          ],
        },
      });

      const cashOutTransactions = [];
      const cashInTransactions = [];

      transactions.forEach((transaction) => {
        if (transaction.debitedAccountId === accountId) {
          cashOutTransactions.push({ type: 'cashOut', ...transaction });
        } else {
          cashInTransactions.push({ type: 'cashIn', ...transaction });
        }
      });

      const typedTransactions = [...cashOutTransactions, ...cashInTransactions];

      const mapedTransactions = await Promise.all(
        typedTransactions.map(async (transaction) => {
          if (transaction.type === 'cashOut') {
            const { username } = await this.prisma.user.findFirst({
              where: {
                accountId: transaction.creditedAccountId,
              },
            });

            return { ...transaction, username };
          }

          const { username } = await this.prisma.user.findFirst({
            where: {
              accountId: transaction.debitedAccountId,
            },
          });

          return { ...transaction, username };
        }),
      );

      return mapedTransactions;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async findAllTransactionsByDate({ accountId, date }: TransactionsByDate) {
    try {
      const formatedDate = new Date(date).toISOString();

      const transactions = await this.prisma.transaction.findMany({
        where: {
          OR: [
            { debitedAccountId: accountId },
            { creditedAccountId: accountId },
          ],
          AND: {
            createdAt: formatedDate,
          },
        },
      });

      const cashOutTransactions = [];
      const cashInTransactions = [];

      transactions.forEach((transaction) => {
        if (transaction.debitedAccountId === accountId) {
          cashOutTransactions.push({ type: 'cashOut', ...transaction });
        } else {
          cashInTransactions.push({ type: 'cashIn', ...transaction });
        }
      });

      const typedTransactions = [...cashOutTransactions, ...cashInTransactions];

      const mapedTransactions = await Promise.all(
        typedTransactions.map(async (transaction) => {
          if (transaction.type === 'cashOut') {
            const { username } = await this.prisma.user.findFirst({
              where: {
                accountId: transaction.creditedAccountId,
              },
            });

            return { ...transaction, username };
          }

          const { username } = await this.prisma.user.findFirst({
            where: {
              accountId: transaction.debitedAccountId,
            },
          });

          return { ...transaction, username };
        }),
      );

      return mapedTransactions;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async findAllTransactionsByType({ accountId, type }: TransactionsByType) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          OR: [
            { debitedAccountId: accountId },
            { creditedAccountId: accountId },
          ],
        },
      });

      const cashOutTransactions = [];
      const cashInTransactions = [];

      transactions.forEach((transaction) => {
        if (transaction.debitedAccountId === accountId) {
          cashOutTransactions.push({ type: 'cashOut', ...transaction });
        } else {
          cashInTransactions.push({ type: 'cashIn', ...transaction });
        }
      });

      const typedTransactions = [...cashOutTransactions, ...cashInTransactions];

      const mapedTransactions = await Promise.all(
        typedTransactions.map(async (transaction) => {
          if (transaction.type === 'cashOut') {
            const { username } = await this.prisma.user.findFirst({
              where: {
                accountId: transaction.creditedAccountId,
              },
            });

            return { ...transaction, username };
          }

          const { username } = await this.prisma.user.findFirst({
            where: {
              accountId: transaction.debitedAccountId,
            },
          });

          return { ...transaction, username };
        }),
      );

      return mapedTransactions.filter(
        (transaction) => transaction.type === type,
      );
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
