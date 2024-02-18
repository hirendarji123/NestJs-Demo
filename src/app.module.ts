import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModuleModule } from './app-config-module/app-config-module.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ReplaceEmptyWithNullInterceptor } from './replace-empty-with-null/replace-empty-with-null.interceptor';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ReplaceEmptyWithNullInterceptor,
    },
  ],
  imports: [
    UserModule,
    AuthModule,
    AppConfigModuleModule,
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.USER_EMAIL,
      },
    }),
  ],
})
export class AppModule {}
