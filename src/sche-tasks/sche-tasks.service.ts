import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Thekeys } from 'src/common/models/theKeys.model';
import { Algorithm } from 'src/common/models/algorithm.model';
import { Backupkeys } from 'src/common/models/backupkeys.model';
import { createKey } from 'src/common/utils/keys.js';

@Injectable()
export class ScheTasksService {
  constructor(
    @InjectModel(Thekeys)
    private readonly thekeysModel: typeof Thekeys,

    @InjectModel(Algorithm)
    private readonly algorithmModel: typeof Algorithm,

    @InjectModel(Backupkeys)
    private readonly backupkeysModel: typeof Backupkeys,
  ){}

  @Interval(1000*60*60*6)
  async updateKeysStatus() {
    const keys = await this.thekeysModel.findAll();
    for (let key of keys) {
      if (new Date(key.deadDate) <= new Date() && key.status != 4) {
        await this.thekeysModel.update({status: 4}, {where: { id: key.id }});
      }
    }
  }

  @Interval(1000*60*60)
  async backupKeys() {
    const backKey = new Backupkeys();
    const algors = await this.algorithmModel.findAll();
    for (let algor of algors) {
      let backedkeys = await this.backupkeysModel.findAll({
        where: {
          way: algor.way
        }
      });

      for (let i = backedkeys.length; i <= 5; i++) {
        let theKey = await createKey(algor);
        let insertData = {
          id: `backupKeys_${Math.random().toFixed(5)}`,
          way: algor.way,
          mykey: theKey.key,
          iv: theKey.iv
        }
        for (let key in insertData) {
          backKey[key] = insertData[key];
        }
        backKey.save();
      }
    }
  }
}
