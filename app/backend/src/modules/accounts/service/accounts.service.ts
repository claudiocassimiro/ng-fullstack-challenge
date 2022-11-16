import { Injectable } from '@nestjs/common';
import { accountDTO } from '../dto/accounts.dto';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
  async create(data: accountDTO) {
    const { userId, id, balance } = data;

    const verifyIfUserExists = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!verifyIfUserExists) {
      throw new Error('User not exists on database');
    }

    return this.prisma.account.create({
      data: {
        id,
        balance,
      },
    });
  }
}
