import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigModuleService {
  get(key: string): string {
    return process.env[key];
  }
}
