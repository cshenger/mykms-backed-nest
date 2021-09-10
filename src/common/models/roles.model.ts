import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'roles',
  timestamps: false,
  freezeTableName: true
})
export class Roles extends Model<Roles> {
  @Column({ primaryKey: true })
  id: string

  @Column
  code: string

  @Column
  text: string
}