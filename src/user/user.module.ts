import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigModuleService } from 'src/app-config-module/app-config-module.service';
import { CommonService } from 'src/commonUtil';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, AppConfigModuleService,CommonService],
})
export class UserModule {}
