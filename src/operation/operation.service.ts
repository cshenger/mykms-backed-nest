import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Thekeys } from 'src/common/models/theKeys.model';
import { keyWrite, decipherKey } from 'src/common/utils/keys.js';

@Injectable()
export class OperationService {
  constructor(
    @InjectModel(Thekeys)
    private readonly thekeysModel: typeof Thekeys,
  ) {}

  async submit(params) {
    const key = await this.thekeysModel.findOne({ where: { id: params.theKey } });
    let result = "";

    try {
      if (params.way == '1') {
        // 加密
        result = await keyWrite(key, params.inputer);
      } else if (params.way == '0') {
        // 解密
        result = await decipherKey(key, params.inputer);
      }
      return result;
    } catch (err) {
      return {
        code: 4001,
        success: false,
        message: '操作失败'
      }
    }
  }
}
