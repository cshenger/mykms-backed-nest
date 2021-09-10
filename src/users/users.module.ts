import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from 'src/common/models/users.model';
import { Roles } from 'src/common/models/roles.model';
import { Usertokens } from 'src/common/models/usertokens.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailModule } from 'src/common/mail/mail.module';
import { OperalogModule } from 'src/operaLog/operaLog.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, Roles, Usertokens]), 
    MailModule,
    OperalogModule
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
