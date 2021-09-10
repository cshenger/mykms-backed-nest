import { Controller, Get, Post, Put, UseGuards, Request, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { OperalogService } from 'src/operaLog/operaLog.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly operalogService: OperalogService,
  ) {}

  // 插入日志成功/失败
  async addUserLog(status: number, req: any) {
    return this.operalogService.addOperaLog({
      url: '/app/users/add',
      method: 'POST',
      action: '新增',
      status: status
    }, req);
  }
  async putUserLog(status: number, req: any) {
     return this.operalogService.addOperaLog({
      url: '/app/users/update',
      method: 'PUT',
      action: '修改',
      status: status
    }, req);
  }

  // 查询列表
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(@Request() req): Promise<any> {
    return this.usersService.list(req.query);
  }

  // 查询具体用户
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async info(@Request() req): Promise<any> {
    const userId = req.query.id;
    return this.usersService.find(userId);
  }

  // 新增/插入
  async create(@Request() req): Promise<any> {
    return this.usersService.create(req.body);
  }

  // 新增用户
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(@Request() req): Promise<any> {
    const result:any = await this.create(req);
    if (result && result.code == 200) {
      await this.addUserLog(1, req);
    } else {
      await this.addUserLog(0, req);
    }
    return result;
  }

  // 编辑用户
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Request() req): Promise<any> {
    const result:any = await this.create(req);
    if (result && result.code == 200) {
      await this.putUserLog(1, req);
    } else {
      await this.putUserLog(0, req);
    }
    return result;
  }

  // 查找审核人
  @UseGuards(JwtAuthGuard)
  @Get('auditList')
  async auditList(): Promise<any> {
    return await this.usersService.auditList();
  }

  // 查找使用人
  @UseGuards(JwtAuthGuard)
  @Get('userList')
  async userList(): Promise<any> {
    return await this.usersService.userList();
  }

  // 删除用户
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Request() req): Promise<any> {
    const result = this.usersService.delete(req.query.id);
    await this.operalogService.addOperaLog({
      url: '/app/users/delete',
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

  // 修改密码
  @UseGuards(JwtAuthGuard)
  @Post('editPassword')
  async editPassword(@Request() req): Promise<any> {
    const result = await this.usersService.editPassword(req.body);
    await this.operalogService.addOperaLog({
      url: '/app/users/editPassword',
      method: 'PUT',
      action: '修改',
      status: result ? 1 : 0
    }, req);
    return result;
  }
}
