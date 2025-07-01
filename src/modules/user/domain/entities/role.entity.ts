import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // admin, mahasiswa, dosen

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
