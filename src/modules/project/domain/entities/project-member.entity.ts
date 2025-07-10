import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

@Entity('project_members')
export class ProjectMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProjectEntity, (project) => project.members)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'boolean' })
  is_leader: boolean;

  @CreateDateColumn()
  created_at: Date;
}
