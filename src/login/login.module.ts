import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from 'src/common/models/users.model';
import { Usertokens } from 'src/common/models/usertokens.model';
import { AuthModule } from 'src/auth/auth.module';
import { ScheTasksModule } from 'src/sche-tasks/sche-tasks.module';
import { OperalogModule } from 'src/operaLog/operaLog.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, Usertokens]), 
    AuthModule, 
    ScheTasksModule,
    OperalogModule
  ],
  providers: [LoginService],
  controllers: [LoginController]
})
export class LoginModule {}
