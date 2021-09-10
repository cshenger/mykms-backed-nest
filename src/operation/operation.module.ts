import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Thekeys } from 'src/common/models/theKeys.model';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { OperalogModule } from 'src/operaLog/operaLog.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Thekeys]),
    OperalogModule
  ],
  providers: [OperationService],
  controllers: [OperationController]
})
export class OperationModule {}
