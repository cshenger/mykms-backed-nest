import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from "./strategies/jwt.strategy"
import { secret } from 'src/common/conmstr';
import { SequelizeModule } from '@nestjs/sequelize';
import { Usertokens } from 'src/common/models/usertokens.model';

@Module({
  imports: [
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: '60m' },
    }),
    SequelizeModule.forFeature([Usertokens])
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
