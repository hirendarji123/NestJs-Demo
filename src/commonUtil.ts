// common.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigModuleService } from './app-config-module/app-config-module.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { error } from 'console';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CommonService {
  constructor(
    private readonly configService: AppConfigModuleService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
  async verifyToken(token: string) {
    try {
      let tokenValid = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_KEY'),
      });
      const userDetails = await this.prismaService.user.findUnique({
        where: { id: tokenValid.userId },
      });
      if (userDetails) {
        return { status: true, data: tokenValid };
      }
      throw error;
    } catch (err) {
      if (err.message == 'jwt malformed') {
        throw new HttpException(
          'Please Enter Valid Formate',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  async generateJWTToken(payload: object, expiresIn: string) {
    try {
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_KEY'),
        expiresIn: expiresIn,
      });
      return token;
    } catch (err) {
      throw new HttpException(
        'Error while generating error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendVerificationCode(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is ${code}`,
    });
  }

  // Generate a random 6-digit number
  async generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }
}
