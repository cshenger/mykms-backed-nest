import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const message = exception.message;
    Logger.log('错误提示', message);
    const errorResponse = {
      data: {
     	 error: message,
    	}, // 获取全部的错误信息
      message: '请求失败',
      code: 1, // 自定义code
      url: request.originalUrl, // 错误的url地址
    };
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 设置返回的状态码、请求头、
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    // 发送错误信息
    response.send(errorResponse);
  }
}
