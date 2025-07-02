import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('expertises')
@Unique(['name'])
export class ExpertiseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
