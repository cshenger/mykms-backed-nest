import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/common/models/users.model';
import { Usertokens } from 'src/common/models/usertokens.model';
import { ChangeUserDto } from './change-user.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,

    @InjectModel(Usertokens)
    private readonly usertokensModel: typeof Usertokens,
  ) {}

  async login(loginName: string, hexPassword: string) {
    const user = await this.usersModel.findOne({
      where: {
        loginName: loginName,
        hexPassword: hexPassword
      }
    });

    return {
      user
    }
  } 

  async changeUserToken(changeUserDto: ChangeUserDto): Promise<Usertokens> {
    const user = await this.usertokensModel.findOne({ where: { id: changeUserDto.id } });
    const usertoken = new Usertokens();

    if (user) {
      this.usertokensModel.update(changeUserDto, { where: { id: changeUserDto.id } });
      return user;
    } else {
      for (let key in changeUserDto) {
        usertoken[key] = changeUserDto[key];
      }
      return usertoken.save();
    }
  }
}
