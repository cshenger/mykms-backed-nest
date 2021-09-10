import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { Users } from 'src/common/models/users.model';
import { Roles } from 'src/common/models/roles.model';
import { Algorithm } from 'src/common/models/algorithm.model'

@Module({
  imports: [SequelizeModule.forFeature([Users, Roles, Algorithm])],
  providers: [DictService],
  controllers: [DictController]
})
export class DictModule {}
