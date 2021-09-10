import { Controller, Get, Post, Put, UseGuards, Request, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OperalogService } from 'src/operaLog/operaLog.service';

@Controller('operaLog')
export class OperalogController {
  constructor(
    private readonly operalogService: OperalogService,
  ) {}

  // 查询列表
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(@Request() req): Promise<any> {
     return this.operalogService.list(req.query);
  }
}