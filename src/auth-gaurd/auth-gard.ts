import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommonService } from 'src/commonUtil';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private commonUtils: CommonService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new HttpException(
        'Please provide authorization in Header',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = request.headers.authorization.split(' ')[1];
    const { status, data } = await this.commonUtils.verifyToken(token);
    request.user = data || {};
    return status;
  }
}
