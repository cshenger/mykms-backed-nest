import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Operalog } from '../common/models/operalog.model';
import { Usertokens } from '../common/models/usertokens.model';
import { OperalogController } from './operaLog.controller';
import { OperalogService } from './operaLog.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Operalog, Usertokens]), 
    AuthModule
  ],
  providers: [OperalogService],
  controllers: [OperalogController],
  exports: [OperalogService]
})
export class OperalogModule {}