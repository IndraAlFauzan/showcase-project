import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { InterestEntity } from 'src/modules/interest/domain/entities/interest.entity';
import { TechnologyEntity } from 'src/modules/technology/domain/entities/technology.entity';

@Entity('student_profiles')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column({ unique: true })
  nim: string;

  @Column()
  angkatan: number;

  @Column({ nullable: true })
  photo_url: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => InterestEntity, { eager: true })
  @JoinTable({
    name: 'student_interests',
    joinColumn: { name: 'student_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
  })
  interests: InterestEntity[];

  @ManyToMany(() => TechnologyEntity, { eager: true })
  @JoinTable({
    name: 'student_technologies',
    joinColumn: { name: 'student_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
  })
  technologies: TechnologyEntity[];
}
