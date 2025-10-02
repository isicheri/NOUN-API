import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private envConfig: EnvConfig = {};

  constructor() {
    // First, load from .env file if it exists
    const filePath = `.env.${process.env.NODE_ENV || 'development'}`;
    const envFile = path.resolve(process.cwd(), filePath);

    if (fs.existsSync(envFile)) {
      this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    } else if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
      this.envConfig = dotenv.parse(
        fs.readFileSync(path.resolve(process.cwd(), '.env')),
      );
    }

    // Merge process.env so deployed env vars override .env
    this.envConfig = {
      ...this.envConfig,
      ...process.env,
    } as unknown as EnvConfig;
  }

  get(key: string): string {
    const value = this.envConfig[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }
}
