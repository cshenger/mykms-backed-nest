import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Users } from 'src/common/models/users.model';
import { Roles } from 'src/common/models/roles.model';
import { Thekeys } from 'src/common/models/theKeys.model';
import { Algorithm } from 'src/common/models/algorithm.model'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, Roles, Algorithm, Thekeys]),
    AuthModule
  ],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
