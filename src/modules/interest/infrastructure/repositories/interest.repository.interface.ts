import { InterestEntity } from '../../domain/entities/interest.entity';

export interface IInterestRepository {
  create(data: Partial<InterestEntity>): Promise<InterestEntity>;
  findAll(): Promise<InterestEntity[]>;
  update(id: number, data: Partial<InterestEntity>): Promise<InterestEntity>;
  delete(id: number): Promise<void>;
  findOne(id: number): Promise<InterestEntity | null>;
}
