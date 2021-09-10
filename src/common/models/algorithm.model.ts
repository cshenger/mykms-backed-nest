import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'algorithm',
  timestamps: false,
  freezeTableName: true
})
export class Algorithm extends Model<Algorithm> {
  @Column({ primaryKey: true })
  id: number

  @Column
  way: string

  @Column
  name: string

  @Column
  mode: string

  @Column
  length: string

  @Column
  alias: string

  @Column({ defaultValue: 0 })
  status: number
}