import { Injectable,Inject } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_OPTIONS } from './constants';
import {EnvConfig,ConfigOptions} from "./interfaces"



@Injectable()
export class ConfigService {
 
private envConfig: EnvConfig;
    
  constructor(@Inject(CONFIG_OPTIONS) options: ConfigOptions) {
    const filePath = `.env.${process.env.NODE_ENV || 'development'}`;
    const envFile =   path.resolve(process.cwd(), filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
     let finalPath = envFile;
    if (!fs.existsSync(envFile)) {
      finalPath = path.resolve(process.cwd(), '.env');
    }

    if (!fs.existsSync(finalPath)) {
      throw new Error(`No .env file found at ${envFile} or .env`);
    }

    this.envConfig = dotenv.parse(fs.readFileSync(finalPath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

}
