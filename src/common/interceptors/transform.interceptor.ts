import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext, 
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { secret } from '../conmstr';

interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async intercept( context: ExecutionContext, next: CallHandler<T>): Promise<Observable<Response<T>>> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    let hasToken = true;
    const mesData = {
      code: 200,
      message: path === '/api/login' ? '登录成功' : '请求成功',
      success: true,
    }

    // 获取并解析token
    if (request.headers.authorization) {
      const usertokens = await this.authService.findUsertokens();
      const token = (request.headers.authorization.split(' '))[1]; // request.headers.authorization;
      const decode = this.authService.verifyToken(token, secret);
      const user = usertokens.find((item) => { return item.loginName == decode.loginName });

      if (user.token !== token) {
        hasToken = false;
      }
    }

    return next.handle().pipe(
      map((data: any) => {
        if (!hasToken && path != '/api/login') {
          data = null;
          mesData.message = '该账户已在其他设备登录';
          mesData.code = 401;
          mesData.success = false;
        } else if (!hasToken && path === '/api/login') {
          Object.keys(data).forEach(key => { mesData[key] = data[key] });
        } else if (hasToken && data && data.code) {
          Object.keys(data).forEach(key => { mesData[key] = data[key] });
        } else if (!data) {
          mesData.message = '请求失败';
          mesData.code = 1;
          mesData.success = false;
        } 

        return {
          data,
          ...mesData
        };
      }),
    );
  }
}
