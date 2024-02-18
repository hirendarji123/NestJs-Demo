import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth-gaurd/auth-gard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  findOne(@Request() req) {
    return this.userService.findOne(req.user.userId);
  }

  @UsePipes(
    new ValidationPipe({
      stopAtFirstError: true,
    }),
  )
  @Patch('')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.userId, updateUserDto);
  }
}
