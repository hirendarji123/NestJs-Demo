import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @IsString()
    @IsOptional()
    name?: string; // ? means optional
  
    @IsString()
    @IsOptional()
    city?: string; // ? means optional
  
    @IsInt()
    @IsOptional()
    age?: number; // ? means optional
}
