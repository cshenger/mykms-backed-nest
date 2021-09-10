import { Controller, Get, Post, Put, UseGuards, Request, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OperationService } from './operation.service';
import { OperalogService } from 'src/operaLog/operaLog.service';

@Controller('operation')
export class OperationController {
  constructor(
    private readonly operationService: OperationService,
    private readonly operalogService: OperalogService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submit(@Request() req): Promise<any> {
    const result: any = await this.operationService.submit(req.body);
    await this.operalogService.addOperaLog({
      url: '/app/operation/submit',
      method: 'POST',
      action: '修改',
      status: result && result.code == 4001 ? 0 : 1
    });
    return result;
  }
}
