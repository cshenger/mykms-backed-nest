import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { UsersModule } from './users/users.module';
import { DictModule } from './dict/dict.module';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheTasksModule } from './sche-tasks/sche-tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AlgorModule } from './algor/algor.module';
import { OperationModule } from './operation/operation.module';
import { KeysModule } from './keys/keys.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '1234567',
      database: 'mykms',
      autoLoadModels: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
    transport: {
        host: "smtp.qq.com",
        port: "465",
        auth: {
          user: "1534739331@qq.com",
          pass: "qaurwlgawczubace"
        }
      },
      defaults: {
        from: '陈晟 <1534739331@qq.com>',
      },
    }),
    UsersModule,
    DictModule,
    LoginModule,
    DashboardModule,
    ScheduleModule.forRoot(),
    ScheTasksModule,
    AlgorModule,
    KeysModule,
    OperationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
