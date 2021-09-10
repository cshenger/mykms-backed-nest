import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
  freezeTableName: true
})
export class Users extends Model<Users> {
  @Column({ primaryKey: true })
  id: string;

  @Column
  loginName: string;

  @Column
  userName: string;

  @Column
  password: string;

  @Column
  roles: string;

  @Column
  email: string;

  @Column
  hexPassword: string;
}
