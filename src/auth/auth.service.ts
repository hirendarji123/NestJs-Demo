import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { CommonService } from 'src/commonUtil';
import { verifyEmailDto } from './dto/verifyEmail.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private commonUtils: CommonService,
  ) {}

  async registration(body: CreateAuthDto) {
    try {
      const { email, password } = body;
      const hashPassword = await bcrypt.hash(password, 10);
      body.password = hashPassword;

      // generating 6 digit OTP
      const OTP = await this.commonUtils.generateOTP();
      body['verificationCode'] = OTP;
      const user = await this.prismaService.user.create({
        data: body,
      });

      //Sending mail to user
      await this.commonUtils.sendVerificationCode(email, OTP);

      delete user.password;

      return {
        status: true,
        message: 'User Created successfully,Please verify your email',
      };
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        throw new ConflictException('Email address is already in use');
      }
      // Handle other types of errors or re-throw them if needed
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(body: CreateUserDto) {
    try {
      const { email, password } = body;
      const user = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          isEmailVerified: true,
        },
      });
      if (!user) {
        throw new HttpException('User is Not Found', HttpStatus.UNAUTHORIZED);
      }
      const { isEmailVerified, id } = user;
      if (!isEmailVerified) {
        throw new HttpException(
          'Your email is not verify,Please verify first.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const tokenPayload = {
        userId: id,
        email: user.email,
      };
      const token = await this.commonUtils.generateJWTToken(tokenPayload, '1h');
      const refresh_token = await this.commonUtils.generateJWTToken(
        tokenPayload,
        '30d',
      );

      if (await bcrypt.compare(password, user.password)) {
        return {
          status: true,
          message: 'User login successfully.',
          access_token: token,
          refresh_token,
        };
      }
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createRefreshToken(body: RefreshTokenDto) {
    try {
      const { refreshToken } = body;
      const { status, data } = await this.commonUtils.verifyToken(refreshToken);

      if (status) {
        const authToken = await this.commonUtils.generateJWTToken(
          { email: data.email, userId: data.userId },
          '1h',
        );
        return {
          status: true,
          message: 'Auth token generated successfully.',
          data: {
            access_token: authToken,
          },
        };
      }
    } catch (err) {
      // Handle other types of errors or re-throw them if needed
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyEMail(body: verifyEmailDto) {
    try {
      const { email, OTP } = body;
      const user = await this.prismaService.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new HttpException('User is Not Found', HttpStatus.UNAUTHORIZED);
      }
      if (user.email === email && user['verificationCode'] === OTP) {
        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            isEmailVerified: true,
            verificationCode: '',
          },
        });
        return {
          status: true,
          message: 'Your email verification is done. ',
        };
      }

      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    } catch (err) {
      // Handle other types of errors or re-throw them if needed
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
