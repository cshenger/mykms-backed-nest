import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Algorithm } from 'src/common/models/algorithm.model';
import { pages } from 'src/common/utils';

@Injectable()
export class AlgorService {
  constructor(
    @InjectModel(Algorithm)
    private readonly algorithmModel: typeof Algorithm,
  ) {}
  
  // 查询列表
  async list(params) {
    let where: any = {}
    if (!!params && params.hasOwnProperty('name') && params.name != '') {
      where.name = params.name;
    }
    if (!!params && params.hasOwnProperty('status') && params.status != '') {
      where.status = params.status;
    }
    let searchData = {
      where: where,
    };

    const { count, rows } = await this.algorithmModel.findAndCountAll(searchData);
    let pag = pages(params);
    let records = rows.slice(pag.start, pag.end);
    records.forEach((item: any) => {
      item.status = Boolean(item.status);
    });

    return {
      records,
      total: count
    }
  }

  // 修改状态
  async toggle(subData: any) {
    const result = await this.algorithmModel.update({status: subData.status}, {where: { id: subData.id }});

    if (result[0] === 1) {
      return {
        code: 200,
        success: true,
        message: '更新成功'
      };
    } else {
      return {
        code: 500,
        success: false,
        message: '更新失败'
      }
    }
  }
}
