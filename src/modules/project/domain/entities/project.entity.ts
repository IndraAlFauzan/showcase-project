import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';

import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { ProjectAnalysisEntity } from './project-analysis.entity';
import { ProjectMediaEntity } from './project-media.entity';
import { ProjectMemberEntity } from './project-member.entity';
import { TechnologyEntity } from 'src/modules/technology/domain/entities/technology.entity';
import { CategoryEntity } from 'src/modules/category/domain/entities/category.entity';
import { StudentEntity } from 'src/modules/student/domain/entities/student.entity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  type: 'web' | 'mobile';

  @Column()
  semester: string;

  @Column({ type: 'boolean', default: false })
  is_top_project: boolean;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @OneToOne(() => ProjectAnalysisEntity, (analysis) => analysis.project, {
    cascade: true,
    eager: true,
  })
  analysis: ProjectAnalysisEntity;

  @OneToMany(() => ProjectMediaEntity, (media) => media.project, {
    cascade: true,
    eager: true,
  })
  media: ProjectMediaEntity[];

  @OneToMany(() => ProjectMemberEntity, (member) => member.project, {
    cascade: true,
    eager: true,
  })
  members: ProjectMemberEntity[];

  @ManyToMany(() => TechnologyEntity, { eager: true })
  @JoinTable({
    name: 'project_technologies',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
  })
  technologies: TechnologyEntity[];

  @ManyToMany(() => CategoryEntity, { eager: true })
  @JoinTable({
    name: 'project_categories',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categories_id', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
