import { Injectable } from '@nestjs/common';
import { IExpertiseRepository } from './expertise.repository.interface';
import { ExpertiseEntity } from '../../domain/entities/expertise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpertiseRepository implements IExpertiseRepository {
  constructor(
    @InjectRepository(ExpertiseEntity)
    private readonly repo: Repository<ExpertiseEntity>,
  ) {}

  async create(data: Partial<ExpertiseEntity>): Promise<ExpertiseEntity> {
    const expertise = this.repo.create(data);
    return this.repo.save(expertise);
  }

  async findAll(): Promise<ExpertiseEntity[]> {
    return this.repo.find();
  }

  async update(
    id: number,
    data: Partial<ExpertiseEntity>,
  ): Promise<ExpertiseEntity> {
    await this.repo.update(id, data);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findOne(id: number): Promise<ExpertiseEntity | null> {
    return this.repo.findOneBy({ id });
  }
}
