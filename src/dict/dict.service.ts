import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Users } from 'src/common/models/users.model';
import { Roles } from 'src/common/models/roles.model';
import { Algorithm } from 'src/common/models/algorithm.model';

@Injectable()
export class DictService {
  constructor(
    private sequelize: Sequelize,

    @InjectModel(Users)
    private readonly usersModel: typeof Users,

    @InjectModel(Roles)
    private readonly rolesModel: typeof Roles,

    @InjectModel(Algorithm)
    private readonly algorithmModel: typeof Algorithm,
  ) {}

  // 角色列表
  async findRoles(): Promise<Roles[]> {
    return this.rolesModel.findAll();
  }

  // 获取算法下拉
  async findAlgors(): Promise<Algorithm[]> {
    const algorithm = await this.algorithmModel.findAll();
    const algors = [];
    algorithm.forEach(item => {
      if (!algors.includes(item.name)) {
        algors.push(item.name);
      }
    });
    return algors;
  }

  // 获取所有算法模式
  async allAlgorWays() {
    const list = await this.algorithmModel.findAll();
    const ways = [];
    list.forEach((algor, algorIndex) => {
      if (ways.some((way) => {
          return way.title == algor.name
        })) {
        ways.forEach(way => {
          if (way.title == algor.name && algor.status == 1) {
            way.children.push({
              title: algor.alias,
              value: algor.way,
              key: algor.way,
              algorithmName: algor.name,
              mode: algor.mode,
              length: algor.length
            })
          }
        });
      } else {
        if (algor.status == 1) {
          ways.push({
            title: algor.name,
            value: algor.name,
            key: algor.name,
            disabled: true,
            children: [{
              title: algor.alias,
              value: algor.way,
              key: algor.way,
              algorithmName: algor.name,
              mode: algor.mode,
              length: algor.length
            }]
          })
        }
      }
    });

    return ways;
  }

  // 用户列表
  async findUsers(): Promise<Users[]> {
    return this.usersModel.findAll();
  }

  // 获取密钥管理员用户
  async keyAdminUsers(): Promise<any[]>{
    let sql = `select id, userName from users where roles like "%keyAdmin%"`;
    const [results, metadata] = await this.sequelize.query(sql);
    return results;
  }

  // 获取密钥审核员用户
  async keyAuditUsers() {
    let sql = `select id, userName from users where roles like "%keyAudit%"`;
    const [results, metadata] = await this.sequelize.query(sql);
    return results;
  }
}
