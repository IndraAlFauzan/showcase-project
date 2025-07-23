import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { StudentEntity } from 'src/modules/student/domain/entities/student.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => StudentEntity, (student) => student.user, { eager: true })
  student_profile: StudentEntity;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
