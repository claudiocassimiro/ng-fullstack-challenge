import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { validatePassword } from '../../../shared/helpers/validatePassword';
import { UserDTO } from '../dto/users.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create(@Body() data: UserDTO) {
    const { username, password } = data;

    if (username.length < 3) {
      throw new HttpException('Username too short', HttpStatus.BAD_REQUEST);
    }

    if (!validatePassword(password)) {
      throw new HttpException('Password too weak', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.create(data);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() { username, password }: UserDTO) {
    if (!username || !password) {
      throw new HttpException(
        "Please don't send empty fields",
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.login({ username, password });
  }

  @Post('/getusername')
  @HttpCode(200)
  async getUsernameByAccountId(@Body() { accountId }: { accountId: string }) {
    if (!accountId) {
      throw new HttpException(
        "Please don't send empty fields",
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(accountId);
    return this.usersService.getUsernameByAccountId(accountId);
  }
}
