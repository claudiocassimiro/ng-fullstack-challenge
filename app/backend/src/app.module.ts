import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ApiTokenCheckMiddleware } from './shared/middlewares/api-token-check.middleware';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { PrismaService } from './shared/database/prisma.service';

@Module({
  imports: [UsersModule, AccountsModule, TransactionsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiTokenCheckMiddleware)
      .forRoutes({ path: '/transactions/*', method: RequestMethod.POST });
    consumer
      .apply(ApiTokenCheckMiddleware)
      .forRoutes({ path: '/accounts/balance', method: RequestMethod.POST });
    consumer
      .apply(ApiTokenCheckMiddleware)
      .forRoutes({ path: '/accounts/cashout', method: RequestMethod.POST });
    consumer
      .apply(ApiTokenCheckMiddleware)
      .forRoutes({ path: '/users/getusername', method: RequestMethod.POST });
  }
}
