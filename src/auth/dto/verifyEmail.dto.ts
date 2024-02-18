import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class verifyEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  
  OTP: string;
}
