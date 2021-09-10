import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Users } from 'src/common/models/users.model';
import { Roles } from 'src/common/models/roles.model';
import { Usertokens } from 'src/common/models/usertokens.model';
import { MailService } from 'src/common/mail/mail.service';
import { pages, getMd5Data, sqlPa } from 'src/common/utils/index';

@Injectable()
export class UsersService {
  constructor(
    private sequelize: Sequelize,

    private readonly mailService: MailService,

    @InjectModel(Users)
    private readonly usersModel: typeof Users,

    @InjectModel(Roles)
    private readonly rolesModel: typeof Roles,

    @InjectModel(Usertokens)
    private readonly usertokensModel: typeof Usertokens
  ) {}

  // 查询列表
  async list(params) {
    let where: any = {}
    if (!!params && params.hasOwnProperty('loginName') && params.loginName != '') {
      where.loginName = params.loginName;
    }
    let searchData = {
      where: where,
    };
    const {
      m,
      n
    } = sqlPa(params);

    // 查询权限表
    const roles = await this.rolesModel.findAll();

    // const records = await this.app.mysql.select('users', searchData);
    // let sql = `select id, loginName, userName, roles from users where loginName like "%${where.hasOwnProperty('loginName') ? where.loginName : ''}%" LIMIT ${searchData.offset||0}, ${searchData.limit||users.length}`;
    // let sql = `select id, loginName, userName, roles from users where loginName like "%${where.hasOwnProperty('loginName') ? where.loginName : ''}%"`;
    let sqlWhere = `loginName like "%${where.hasOwnProperty('loginName') ? where.loginName : ''}%"`;
    let sql = `select id, loginName, userName, roles, (SELECT count(*) FROM users where ${sqlWhere}) AS total from users where ${sqlWhere} limit ${m},${n}`;
    const [results, metadata] = await this.sequelize.query(sql);
    const list: any[] = results;
    let pag = pages(params);
    // let records = list.slice(pag.start, pag.end);
    let records = list;

    records.forEach((user: any) => {
      let userRoles = user.roles.split(",");
      user.fullRoles = [];
      for (let i = 0; i < roles.length; i++) {
        if (userRoles.includes(roles[i].code)) {
          user.fullRoles.push(roles[i]);
        }
      }
    });

    return {
      records,
      // total: records.length
      total: list.length > 0 ? list[0].total : 0
    }
  }  

  // 查询具体用户
  async find(id) {
    const user = await this.usersModel.findOne({ where: { id: id } });
    return {
      user
    }
  }

  // 发送邮件
  async sendMail(params: any): Promise<any> {
    const roles = await this.rolesModel.findAll();
    let title = params.id ? '修改' : '创建';
    let rolesText = "";
    let userRoles = Array.isArray(params.roles) ? params.roles : params.roles.split(",");
    userRoles.forEach(id => {
      for (let i = 0; i < roles.length; i++) {
        if (id == roles[i].code) {
          rolesText += `${roles[i].text}, `;
          break;
        }
      }
    });

    return await this.mailService.mail(
      params.email,
      `账号${title}成功`,
      `您的账号已${title}成功`,
      `<html>
        <p>您的账户已${title}成功</p>
        <p>登录名：<b>${params.loginName}</b></p>
        <p>密码：<b>${params.password}</b></p>
        <p>角色：<b>${rolesText}</b></p>
        <p>如有疑问请联系管理员</p>
      </html>`
    )
  }

  // 插入/修改一条数据
  async create(params) {
    const { count, rows } = await this.usersModel.findAndCountAll();
    let insertData = JSON.parse(JSON.stringify(params));
    insertData.roles = insertData.roles.join(",");
    insertData.hexPassword = getMd5Data(params.password);
    if (!params.hasOwnProperty('id')) {
      insertData.id = `user_${count}_${Math.random().toFixed(5)}`;
    }

    const findUsers = await this.usersModel.findAndCountAll({
      where: {
        loginName: params.loginName
      }
    });
    // console.log('findUsers: ', findUsers);

    if (params.hasOwnProperty('id')) {
      // 更新操作
      if (findUsers.count === 0 || (findUsers.count === 1 && findUsers.rows[0].id === params.id)) {
        const result = await this.usersModel.update(insertData, { where: {id: insertData.id} });
        if (result && result[0] === 1) {
          await this.sendMail(params);
          return {
            code: 200,
            success: true,
            message: '更新成功'
          }
        } else {
          return {
            code: 500,
            success: false,
            message: '更新失败'
          }
        }
      } else {
        return {
          code: 4001,
          success: false,
          message: '登录名重复'
        }
      }
    } else {
      // 新增操作
      if (findUsers.rows.length > 0) {
        return {
          code: 4001,
          success: false,
          message: '登录名已存在'
        }
      } else {
        const user = new Users();
        Object.keys(insertData).forEach(key  => { user[key] = insertData[key] });
        await this.sendMail(params);
        return user.save()
          .then(() => {
            return {
              code: 200,
              success: true,
              message: '添加成功'
            };
          }).catch(err => {
            return {
              code: 500,
              success: false,
              message: err
            }
          });
      }
    }
  }

  // 查找审核人
  async auditList() {
    let sql = `select id, loginName, userName from users where roles like "%keyAudit%"`;
    const [result, metadata] = await this.sequelize.query(sql);
    return result;
  }

  // 查找使用人
  async userList() {
    let sql = `select id, loginName, userName from users where roles like "%keyUser%"`;
    const [result, metadata] = await this.sequelize.query(sql);
    return result;
  }

  // 删除
  async delete(id) {
    const result = await this.usersModel.destroy({ where: { id: id } });
    await this.usertokensModel.destroy({ where: { id: id } });
    return result;
  }

  // 修改密码
  async editPassword(params) {
    const user = await this.usersModel.findOne({ where: { id:  params.userId } });
    if (user.password !== params.oldPass) {
      return {
        code: 500,
        success: false,
        message: '旧密码有误'
      }
    } else {
      let insertData = {
        id: params.userId,
        password: params.newPass,
        hexPassword: getMd5Data(params.newPass)
      }

      const result = await this.usersModel.update(insertData, { where: {id: insertData.id} });
      const userEditer = await this.usersModel.findOne({ where: { id:  params.userId } });
      console.log('userEditer: ', userEditer);

      if (result && result[0] === 1) {
        await this.sendMail(userEditer);
        return {
          code: 200,
          success: true,
          message: '密码修改成功'
        }
      } else {
        return {
          code: 500,
          success: false,
          message: '更新失败'
        }
      }
    }
  }
}
