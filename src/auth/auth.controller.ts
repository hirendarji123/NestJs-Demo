import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { verifyEmailDto } from './dto/verifyEmail.dto';

@Controller('auth')
@UsePipes(
  new ValidationPipe({
    // transform:true // used for convert
    // dismissDefaultMessages: true // disable default message and used our customer message
    // disableErrorMessages:true// disable all error message
    // whitelist: true // if we add any other properties in which not in DTO its will be trim or remove
    // very useful whitelist
    stopAtFirstError: true, // show only 1 validation error not show all message
  }),
)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  registration(@Body() body: CreateAuthDto) {
    return this.authService.registration(body);
  }

  @Post('login')
  login(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }

  @Post('getTokenByRefreshToken')
  createRefreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.createRefreshToken(body);
  }

  @Post('verifyEmail')
  verifyEmail(@Body() body: verifyEmailDto) {
    return this.authService.verifyEMail(body);
  }
}
