import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestEntity } from '../../domain/entities/interest.entity';
import { IInterestRepository } from './interest.repository.interface';

@Injectable()
export class InterestRepository implements IInterestRepository {
  constructor(
    @InjectRepository(InterestEntity)
    private readonly repo: Repository<InterestEntity>,
  ) {}

  async create(data: Partial<InterestEntity>): Promise<InterestEntity> {
    const Interest = this.repo.create(data);
    return this.repo.save(Interest);
  }

  async findAll(): Promise<InterestEntity[]> {
    return this.repo.find();
  }

  async update(
    id: number,
    data: Partial<InterestEntity>,
  ): Promise<InterestEntity> {
    await this.repo.update(id, data);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findOne(id: number): Promise<InterestEntity | null> {
    return this.repo.findOneBy({ id });
  }
}
