import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Usertokens } from 'src/common/models/usertokens.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectModel(Usertokens)
    private readonly usertokensModel: typeof Usertokens,
  ) {}

  // 生成token
  async renderToken(user: any) {
    return this.jwtService.sign(user);
  }

  // 解码token
  verifyToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret: secret })
  }

  // 查找usertokens
  async findUsertokens() {
    return this.usertokensModel.findAll();
  }
}
