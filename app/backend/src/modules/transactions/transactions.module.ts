import { Module } from '@nestjs/common';
import { TransactionsService } from './service/transactions.service';
import { TransactionsController } from './controller/transactions.controller';
import { PrismaService } from 'src/shared/database/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
