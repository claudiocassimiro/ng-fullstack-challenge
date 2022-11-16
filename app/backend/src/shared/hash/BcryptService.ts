import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService {
  constructor() {}

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      throw new Error(error);
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error(error);
    }
  }
}
