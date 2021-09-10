import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheTasksService } from 'src/sche-tasks/sche-tasks.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scheTasksService: ScheTasksService,
  ) {
    // 项目启动后立即执行
    this.scheTasksService.backupKeys();
    this.scheTasksService.updateKeysStatus();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
