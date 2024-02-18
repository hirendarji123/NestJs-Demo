import { Module } from '@nestjs/common';
import { AppConfigModuleService } from './app-config-module.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AppConfigModuleService],
})
export class AppConfigModuleModule {}
