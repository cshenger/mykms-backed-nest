import { Controller, Get, Post, Put, UseGuards, Request, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AlgorService } from './algor.service';
import { OperalogService } from 'src/operaLog/operaLog.service';

@Controller('algor')
export class AlgorController {
  constructor(
    private readonly algorService: AlgorService,
    private readonly operalogService: OperalogService,
  ) {}

  // 查询列表
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(@Request() req): Promise<any> {
    return this.algorService.list(req.query);
  }

  // 修改状态
  @UseGuards(JwtAuthGuard)
  @Put('toggle')
  async toggle(@Request() req): Promise<any> {
    const result = await this.algorService.toggle(req.body);
    await this.operalogService.addOperaLog({
      url: '/app/algor/toggle',
      method: 'PUT',
      action: '修改',
      status: result ? 1 : 0
    }, req);
    return result;
  }
}
