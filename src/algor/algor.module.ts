import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Algorithm } from 'src/common/models/algorithm.model';
import { AlgorService } from './algor.service';
import { AlgorController } from './algor.controller';
import { OperalogModule } from 'src/operaLog/operaLog.module';

@Module({
  imports: [ 
    SequelizeModule.forFeature([Algorithm]),
    OperalogModule
  ],
  providers: [AlgorService],
  controllers: [AlgorController]
})
export class AlgorModule {}
