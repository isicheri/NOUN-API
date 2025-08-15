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
    const filePath = `.env${process.env.NODE_ENV || 'development'}`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

}
