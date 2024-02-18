import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  //   @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  //   @ApiProperty({ required: false })
  @IsInt()
  @IsNotEmpty()
  age?: number;
}
