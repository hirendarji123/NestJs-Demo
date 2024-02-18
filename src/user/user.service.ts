import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number) {
    try {
      const userData = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
      if (userData) {
        //Removing password
        if (userData) {
          delete userData['password'];
          delete userData['verificationCode'];
        }

        return {
          statusCode: 200,
          message: 'Data retrieve successfully.',
          data: userData,
          error: null,
        };
      }

      throw new HttpException('Use not found.', HttpStatus.BAD_REQUEST);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userToUpdate = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      // If user is not found, handle the error or return
      if (!userToUpdate) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      // Update the user excluding the password field
      const excludeFields = [
        'email',
        'password',
        'isEmailVerified',
        'verificationCode',
      ];
      Object.keys(updateUserDto).map((item) => {
        if (excludeFields.includes(item)) {
          delete updateUserDto[item];
        }
      });

      const updatedUser = await this.prismaService.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });

      //Removing password
      if (updatedUser) {
        delete updatedUser['password'];
        delete updatedUser['verificationCode'];
      }

      return {
        statusCode: 200,
        message: 'Data updated successfully.',
        data: updatedUser,
        error: null,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
