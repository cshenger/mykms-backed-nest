import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'backupkeys',
  timestamps: false,
  freezeTableName: true
})
export class Backupkeys extends Model<Backupkeys> {
  @Column({ primaryKey: true })
  id: string

  @Column
  way: string

  @Column
  mykey: Buffer

  @Column
  iv: Buffer
}