import {
  IsString,
  IsInt,
  IsNumber,
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{6,}$/,
    { message: 'Password too weak' },
  )
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name?: string; // ? means optional

  @IsString()
  @IsOptional()
  city?: string; // ? means optional

  @IsInt()
  @IsOptional()
  age?: number; // ? means optional

  @IsInt()
  @IsOptional()
  verificationCode?: string; // ? means optional
}
