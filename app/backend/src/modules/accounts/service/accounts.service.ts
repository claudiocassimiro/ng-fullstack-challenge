import { Injectable } from '@nestjs/common';
import { accountDTO } from '../dto/accounts.dto';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
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
      throw new Error(error);
    }
  }

  async getBalance(accountId: string) {
    try {
      const { balance } = await this.prisma.account.findFirst({
        where: {
          id: accountId,
        },
      });

      return balance;
    } catch (error) {
      throw new Error(error);
    }
  }
}
