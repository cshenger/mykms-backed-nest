import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'operalog',
  timestamps: false,
  freezeTableName: true
})
export class Operalog extends Model<Operalog> {
  @Column({ primaryKey: true })
  id: Number

  @Column
  loginName: string

  @Column
  userName: string

  @Column
  userId: string

  @Column
  operaDate: Date

  @Column
  url: string

  @Column
  method: string

  @Column
  action: string

  @Column
  status: Number
}