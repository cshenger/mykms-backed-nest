import { Module } from '@nestjs/common';
import { ScheTasksService } from './sche-tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Thekeys } from 'src/common/models/theKeys.model';
import { Algorithm } from 'src/common/models/algorithm.model';
import { Backupkeys } from 'src/common/models/backupkeys.model';

@Module({
  imports: [SequelizeModule.forFeature([Thekeys, Algorithm, Backupkeys])],
  providers: [ScheTasksService],
  exports: [ScheTasksService]
})
export class ScheTasksModule {}
