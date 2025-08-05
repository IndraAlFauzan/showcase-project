import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('project_media')
export class ProjectMediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'image' | 'video' | 'pdf' | 'repo' | 'demo';

  @Column()
  title: string;

  @Column()
  url: string;

  @ManyToOne(() => ProjectEntity, (project) => project.media, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @CreateDateColumn()
  created_at: Date;
}
