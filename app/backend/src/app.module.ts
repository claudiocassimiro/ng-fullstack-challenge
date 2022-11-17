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

@Module({
  imports: [UsersModule, AccountsModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiTokenCheckMiddleware)
      .forRoutes(
        { path: 'accounts', method: RequestMethod.POST },
        { path: 'transactions', method: RequestMethod.POST },
      );
  }
}
