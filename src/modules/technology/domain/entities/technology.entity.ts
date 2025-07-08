import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('technologies')
@Unique(['name'])
export class TechnologyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
