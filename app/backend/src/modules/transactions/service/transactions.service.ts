import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { randomUUID } from 'crypto';
import { TransactionsDTO } from '../dto/transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: TransactionsDTO) {
    try {
      const id = randomUUID();

      return this.prisma.transaction.create({ data: { id, ...data } });
    } catch (error) {
      throw new Error(error);
    }
  }
}
