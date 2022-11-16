import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [UsersModule, AccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
