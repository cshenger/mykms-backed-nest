import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'usertokens',
  timestamps: false,
  freezeTableName: true
})
export class Usertokens extends Model<Usertokens> {
  @Column({primaryKey: true})
  id: string

  @Column
  loginName: string;

  @Column
  userName: string;

  @Column
  userRole: string;

  @Column
  token: string;
}