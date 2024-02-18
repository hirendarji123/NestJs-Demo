import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigModuleService } from 'src/app-config-module/app-config-module.service';
import { CommonService } from 'src/commonUtil';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AppConfigModuleService,
    JwtService,
    CommonService,
  ],
})
export class AuthModule {}
