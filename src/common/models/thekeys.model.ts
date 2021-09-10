import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'thekeys',
  timestamps: false,
  freezeTableName: true
})
export class Thekeys extends Model<Thekeys> {
  @Column({ primaryKey: true })
  id: string

  @Column
  way: string

  @Column
  keyName: string

  @Column
  algorithmName: string

  @Column
  mode: string

  @Column
  length: number

  @Column
  deadDate: Date

  @Column
  keyUser: string

  @Column
  remark: string

  @Column
  createUser: string

  @Column
  createDate: Date

  @Column
  auditUser: string

  @Column
  auditDate: Date

  @Column
  status: number

  @Column
  mykey: Buffer

  @Column
  iv: Buffer

  @Column
  reason: string
}