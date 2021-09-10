import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Operalog } from 'src/common/models/operalog.model';
import { Usertokens } from 'src/common/models/usertokens.model';
import { AuthService } from 'src/auth/auth.service';
import { secret } from 'src/common/conmstr';
import { pages, renderWhere, selLike, sqlPa } from 'src/common/utils/index';
const moment = require('moment');

@Injectable()
export class OperalogService {
  constructor(
    private sequelize: Sequelize,

    private readonly authService: AuthService,

    @InjectModel(Operalog)
    private readonly operalogModel: typeof Operalog,

    @InjectModel(Usertokens)
    private readonly usertokensModel: typeof Usertokens
  ) {}

  // 获取操作日志
  async list(params) {
    let where = renderWhere(params, ["userId", "method", "action"]);
    let searchData = {
      where: where
    };
    const {
      m,
      n
    } = sqlPa(params);

    let operaDateSql = !!params.startTime ? `and operaDate>='${params.startTime}' and operaDate<='${params.endTime}'` : "";
    let sqlWhere = `${selLike(where, 'userId')} and ${selLike(where, 'method')} and ${selLike(where, 'action')} ${operaDateSql}`;
    let sql = `select * ,( SELECT count(*) FROM operaLog where ${sqlWhere} order by operaDate desc) AS total from operaLog where ${sqlWhere} order by operaDate desc limit ${m},${n}`;
    const [results, metadata] = await this.sequelize.query(sql);
    const list: any[] = results;
    let records = list;

    const renderList = async () => {
      for (let item of records) {
        item.operaDate = moment(new Date(item.operaDate)).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    }
    await renderList();

    return {
      records,
      total: list.length > 0 ? list[0].total : 0
      // total: list.length
    }
  }

  // 添加操作日志的方法
  async addOperaLog(params: any, req: any=null) {
    const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log('now: ', now);
    let userData: any = {
      operaDate: now
    };

    if (req && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]; // req.headers.authorization;
      const decode = await this.authService.verifyToken(token, secret);
      const user = await this.usertokensModel.findOne({ where: { loginName: decode.loginName } });

      userData = {
        loginName: user.loginName,
        userName: user.userName,
        userId: user.id,
        operaDate: now
      }
    }
    let insertData = Object.assign(userData, params);

    const operalog = new Operalog();
    Object.keys(insertData).forEach(key => { operalog[key] = insertData[key] });
    return operalog.save();
  }
}