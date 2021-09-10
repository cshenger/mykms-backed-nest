import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Thekeys } from 'src/common/models/theKeys.model';
import { Users } from 'src/common/models/users.model';
import { Backupkeys } from 'src/common/models/backupkeys.model';
import { pages, renderWhere, selLike, sqlPa } from 'src/common/utils/index';
import { createKey } from 'src/common/utils/keys.js';
const moment = require('moment');

const statusData = [{
    code: 0,
    text: '草稿'
  },
  {
    code: 1,
    text: '待审核'
  },
  {
    code: 2,
    text: '审核通过'
  },
  {
    code: 3,
    text: '审核不通过'
  },
  {
    code: 4,
    text: '已过期'
  }
];

@Injectable()
export class KeysService {
  constructor(
    private sequelize: Sequelize,

    @InjectModel(Thekeys)
    private readonly thekeysModel: typeof Thekeys,

    @InjectModel(Users)
    private readonly usersModel: typeof Users,

    @InjectModel(Backupkeys)
    private readonly backupkeysModel: typeof Backupkeys,
  ) {}

  // 密钥状态下拉
  async status() {
    const status = JSON.parse(JSON.stringify(statusData));
    status.pop();
    return status;
  }

  // 密钥列表
  async list(params) {
    let where = renderWhere(params, ["id", "keyName", "algorithmName", "status"]);
    let searchData = {
      where: where
    }
    let list = null;
    const {
      m,
      n
    } = sqlPa(params);

    if (params.type == 'using') {
      // let sql = `select * from theKeys where ${selLike(where, 'id')} and ${selLike(where, 'keyName')} and ${selLike(where, 'algorithmName')} and status <> 4`;
      let sqlWhere = `${selLike(where, 'id')} and ${selLike(where, 'keyName')} and ${selLike(where, 'algorithmName')} and ${selLike(where, 'status')} and status <> 4`;
      let sql = `select * ,( SELECT count(*) FROM theKeys where ${sqlWhere} order by createDate desc) AS total from theKeys where ${sqlWhere} order by createDate desc limit ${m},${n}`;
      const [results, metadata] = await this.sequelize.query(sql);
      list = results;
    } else if (params.type == 'history') {
      let sqlWhere = `${selLike(where, 'id')} and ${selLike(where, 'keyName')} and ${selLike(where, 'algorithmName')} and ${selLike(where, 'status')}`;
      let sql = `select *,( SELECT count(*) FROM theKeys where ${sqlWhere} order by createDate desc) AS total from theKeys where ${sqlWhere} order by createDate desc limit ${m},${n}`;
      const [results, metadata] = await this.sequelize.query(sql);
      list = results;
    }

    let pag = pages(params);
    // let records = list.slice(pag.start, pag.end);
    let records = list;

    const renderList = async () => {
      for (let item of records) {
        for (let i = 0; i < statusData.length; i++) {
          if (item.status == statusData[i].code) {
            item.status = {
              code: statusData[i].code,
              value: statusData[i].text
            }
            break;
          }
        }
        item.createUser = JSON.parse(item.createUser);
        item.createDate = moment(new Date(item.createDate)).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        item.deadDate = moment(new Date(item.deadDate)).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        if (item.auditUser) {
          item.auditUser = JSON.parse(item.auditUser);
        }
        if (item.auditDate) {
          item.auditDate = moment(new Date(item.auditDate)).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        delete item.mykey;
        delete item.iv;

        let keyUsers = item.keyUser.split(",");
        item.keyUser = [];
        for (let userId of keyUsers) {
          const user = await this.usersModel.findOne({ where: { id: userId } });
          if (user) {
            item.keyUser.push({
              code: user.id,
              value: user.userName
            });
          }
        }
      }
    }

    await renderList();

    return {
      records,
      total: list.length > 0 ? list[0].total : 0
      // total: list.length
    }
  }

  // 查询一个密钥
  async find(id) {
    const key = await this.thekeysModel.findOne({ where: { id: id } });

    return {
      key
    }
  }

  // 新增/编辑一个密钥
  async create(params) {
    const keys = await this.thekeysModel.findAll();

    const rendeKey = async (params) => {
      const { count, rows } =await this.backupkeysModel.findAndCountAll({ where: { way: params.way } })
      let backupkeys = rows;
      let myKey = null;
      if (count > 0) {
        let backkey = backupkeys[0];
        myKey = {
          key: backkey.mykey,
          iv: backkey.iv
        };
        await this.backupkeysModel.destroy({ where: { id: backkey.id } });
      } else {
        myKey = await createKey(params);
      }

      return myKey;
    }

    let insertData = JSON.parse(JSON.stringify(params));
    if (!params.hasOwnProperty('id')) {
      insertData.id = `keys_${keys.length}_${Math.random().toFixed(8)}`;
      insertData.status = 0;
      const user = await this.usersModel.findOne({ where: { loginName: params.createUser } });
      insertData.createUser = JSON.stringify({
        code: user.id,
        value: user.userName
      });
      insertData.createDate = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      let myKey = await rendeKey(params);
      insertData.mykey = myKey.key;
      insertData.iv = myKey.iv;
    } else {
      const skey: any = await this.thekeysModel.findOne({ where: { id: insertData.id } });
      if (skey.way === insertData.way) {
        insertData.mykey = skey.key;
        insertData.iv = skey.iv;
      } else {
        let myKey = await rendeKey(params);
        insertData.mykey = myKey.key;
        insertData.iv = myKey.iv;
      }
    }

    if (params.hasOwnProperty('id')) {
      // 更新
      const result = await this.thekeysModel.update(insertData, { where: { id: insertData.id } });
      if (result[0] === 1) {
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
      // 新增
      const theKey = new Thekeys();
      Object.keys(insertData).forEach(key => { theKey[key] = insertData[key] });

      return theKey.save()
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

  // 删除
  async delete(id) {
    const result = await this.thekeysModel.destroy({ where: { id: id } });
    return result;
  }

  // 提交
  async send(params) {
    let subData: any = {
      id: params.sendId,
      status: 1
    }

    const user = await this.usersModel.findOne({ where: { id: params.auditer } });
    if (user) {
      subData.auditUser = JSON.stringify({
        code: user.id,
        value: user.userName
      });
    }

    const result = await this.thekeysModel.update(subData, { where: { id: subData.id } });
    if (result[0] === 1) {
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
  }

  // 审核
  async audit(params) {
    let subData = {
      id: params.id,
      status: params.result,
      reason: params.reason,
      auditDate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    }

    const result = await this.thekeysModel.update(subData, { where: { id: subData.id } });
    if (result[0] === 1) {
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
  }

  // 用户可操作性密钥
  async userKeys(params) {
    const user = await this.usersModel.findOne({ where: { loginName: params.loginName } });
    // console.log('user: ', user);
    let sql = `select id,keyName from theKeys where keyUser like "%${user.id}%" and status=2`;
    const [results, metadata] = await this.sequelize.query(sql);
    return results;
  }
}
