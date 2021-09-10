import { Controller, Get } from '@nestjs/common';
import { DictService } from './dict.service';
import { Users } from 'src/common/models/users.model';
import { Roles } from 'src/common/models/roles.model';
import { Algorithm } from 'src/common/models/algorithm.model';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  // 角色列表
  @Get('roles')
  async findRoles(): Promise<any> {
    const roles = await this.dictService.findRoles();;
    return { roles: roles } 
  }
  
  // 获取算法下拉
  @Get('algors')
  findAlgors(): Promise<Algorithm[]> {
    return this.dictService.findAlgors();
  }

  // 获取所有算法模式
  @Get('allAlgorWays')
  allAlgorWays(): Promise<any[]> {
    return this.dictService.allAlgorWays();
  }

  // 用户列表
  @Get('users')
  findUsers(): Promise<Users[]> {
    return this.dictService.findUsers();
  }

  // 获取密钥管理员用户
  @Get('keyAdminUsers')
  keyAdminUsers(): Promise<any[]> {
    return this.dictService.keyAdminUsers();
  }

  // 获取密钥审核员用户
  @Get('keyAuditUsers')
  keyAuditUsers(): Promise<any[]> {
    return this.dictService.keyAuditUsers();
  }
}
