import { Injectable } from '@nestjs/common';
import { accountDTO } from '../dto/accounts.dto';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
  async create(data: accountDTO) {
    const { id, balance } = data;

    return this.prisma.account.create({
      data: {
        id,
        balance,
      },
    });
  }
}
