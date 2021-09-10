import { Controller, Get, Post, Request, UseInterceptors } from '@nestjs/common';
import { LoginService } from './login.service';
import { AuthService } from 'src/auth/auth.service';
import { OperalogService } from 'src/operaLog/operaLog.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly authService: AuthService,
    private readonly operalogService: OperalogService
  ) { }

  @Post()
  async login(@Request() req) {
    const { loginName, hexPassword } = req.body;
    const { user } = await this.loginService.login(loginName, hexPassword);

    // 插入操作文档
    await this.operalogService.addOperaLog({
      loginName: user ?user.loginName : loginName,
      userName: user ? user.userName : '',
      userId: user ? user.id : '',
      url: '/app/login',
      method: 'POST',
      action: '登录',
      status: user ? 1 : 0
    });

    if (user && user.loginName === loginName && user.hexPassword === hexPassword) {
      const token = await this.authService.renderToken(req.body);

      let insertData = {
        token: token,
        userId: user.id,
        loginName: user.loginName,
        userName: user.userName,
        userRole: user.roles.split(",")
      }

      let userTokenData = JSON.parse(JSON.stringify(insertData));
      userTokenData.id = userTokenData.userId;
      delete userTokenData.userId;
      userTokenData.userRole = userTokenData.userRole.join(",");

      await this.loginService.changeUserToken(userTokenData);

      return insertData;
    } else {
      return {
        code: 4001,
        message: '账户名或密码有误',
        success: false
      }
    }
  }
}
