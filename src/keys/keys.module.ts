import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Thekeys } from 'src/common/models/theKeys.model';
import { Users } from 'src/common/models/users.model';
import { Backupkeys } from 'src/common/models/backupkeys.model';
import { OperalogModule } from 'src/operaLog/operaLog.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Thekeys, Users, Backupkeys]), 
    OperalogModule,
    AuthModule
  ],
  providers: [KeysService],
  controllers: [KeysController]
})
export class KeysModule {}
