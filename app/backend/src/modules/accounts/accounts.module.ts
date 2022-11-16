import { Module } from '@nestjs/common';
import { AccountsService } from './service/accounts.service';
import { AccountsController } from './controller/accounts.controller';
import { PrismaService } from 'src/shared/database/prisma.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService],
})
export class AccountsModule {}
