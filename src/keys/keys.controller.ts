import { Controller, Get, Post, Put, UseGuards, Request, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { KeysService } from './keys.service';
import { AuthService } from 'src/auth/auth.service';
import { OperalogService } from 'src/operaLog/operaLog.service';
import { secret } from 'src/common/conmstr';

@Controller('keys')
export class KeysController {
  constructor(
    private readonly keysService: KeysService,
    private readonly operalogService: OperalogService,
    private readonly authService: AuthService,
  ) {}

  // 插入日志成功/失败
  async addKeyLog(status: number, req: any) {
    return this.operalogService.addOperaLog({
      url: '/app/keys/add',
      method: 'POST',
      action: '新增',
      status: status
    }, req);
  }
  async putKeyLog(status: number, req: any) {
     return this.operalogService.addOperaLog({
      url: '/app//keys/update',
      method: 'PUT',
      action: '修改',
      status: status
    }, req);
  }

  // 状态列表
  @Get('status')
  async status() {
    return this.keysService.status();
  }

  // 数据列表
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(@Request() req): Promise<any> {
    return this.keysService.list(req.query);
  }

  // 查询一个密钥
  @UseGuards(JwtAuthGuard)
  @Get('key')
  async info(@Request() req): Promise<any> {
    return this.keysService.find(req.query.id);
  }

  // 新增/插入
  async create(@Request() req): Promise<any> {
    return this.keysService.create(req.body);
  }

  // 新增密钥
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(@Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1]; // req.headers.authorization;
    const decode = await this.authService.verifyToken(token, secret);
    const body = req.body;
    if (!body.id) {
      body.createUser = decode.loginName;
    }

    const result:any = await this.create(req);
    if (result && result.code == 200) {
      await this.addKeyLog(1, req);
    } else {
      await this.addKeyLog(0, req);
    }
    return result;
  }

  // 编辑密钥
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];  // req.headers.authorization;
    const decode = await this.authService.verifyToken(token, secret);
    const body = req.body;
    if (!body.id) {
      body.createUser = decode.loginName;
    }

    const result:any = await this.create(req);
    if (result && result.code == 200) {
      await this.putKeyLog(1, req);
    } else {
      await this.putKeyLog(0, req);
    }
    return result;
  }

  // 删除
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Request() req): Promise<any> {
    const result = await this.keysService.delete(req.query.id);
    // 插入操作文档
    await this.operalogService.addOperaLog({
      url: '/app/keys/delete',
      method: 'DELETE',
      action: '删除',
      status: result ? 1 : 0
    }, req);
    return {
      code: result ? 200 : 4001,
      success: result ? true : false,
      message: result ? '删除成功' : '删除失败'
    };
  }

  // 提交
  @UseGuards(JwtAuthGuard)
  @Put('send')
  async send(@Request() req): Promise<any> {
    const result: any = await this.keysService.send(req.body);
    await this.operalogService.addOperaLog({
      url: '/app/keys/send',
      method: 'PUT',
      action: '修改',
      status: result && result.code == 200 ? 1 : 0
    }, req);
    return result;
  }

  // 审核
  @UseGuards(JwtAuthGuard)
  @Put('audit')
  async audit(@Request() req): Promise<any> {
    const result: any = await this.keysService.audit(req.body);
    await this.operalogService.addOperaLog({
     url: '/app/keys/audit',
      method: 'PUT',
      action: '修改',
      status: result && result.code == 200 ? 1 : 0
    }, req);
    return result;
  }

  // 用户可操作密钥
  @UseGuards(JwtAuthGuard)
  @Get('userKeys')
  async userKeys(@Request() req): Promise<any> {
    const token =  req.headers.authorization.split(' ')[1];  // req.headers.authorization;
    const decode = await this.authService.verifyToken(token, secret);
    let params = {
      loginName: decode.loginName
    }
    return this.keysService.userKeys(params);
  }
}
