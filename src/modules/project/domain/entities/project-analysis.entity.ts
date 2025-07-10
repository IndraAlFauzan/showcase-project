import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('project_analysis')
export class ProjectAnalysisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  problem_background: string;

  @Column('text')
  project_goal: string;

  @Column('text')
  target_user: string;

  @Column('text')
  system_needs: string;

  @OneToOne(() => ProjectEntity, (project) => project.analysis)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
