import { Controller, Get, Request, UseGuards, Headers } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  // 获取用户分布
  @UseGuards(JwtAuthGuard)
  @Get('userroles')
  userroles(@Request() req): Promise<any[]> {
    return this.dashboardService.userroles(req);
  }

  // 待办事项
  @UseGuards(JwtAuthGuard)
  @Get('todoList')
  async todoList(@Headers() headers): Promise<any[]> {
    return this.dashboardService.todoList(headers);
  }

  // 密钥算法统计
  @UseGuards(JwtAuthGuard)
  @Get('algorKeys')
  async algorKeys(@Request() req): Promise<any[]> {
    return this.dashboardService.algorKeys(req.query);
  }

  // 密钥状态统计
  @UseGuards(JwtAuthGuard)
  @Get('statusKeys')
  async statusKeys(@Request() req): Promise<any[]> {
    return this.dashboardService.statusKeys(req.query);
  }

  // 密钥日期趋势
  @UseGuards(JwtAuthGuard)
  @Get('keysMonth')
  async keysMonth(@Request() req): Promise<any> {
    const query = req.query;
    let params = {
      createUser: query.createUser,
      year: "",
      month: "",
    };
    let dateds = query.dated.split("-");
    params.year = dateds[0];
    params.month = dateds[1];
    return this.dashboardService.keysMonth(params);
  }
}
