import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnologyEntity } from '../../domain/entities/technology.entity';
import { ITechnologyRepository } from './technology.repository.interface';

@Injectable()
export class TechnologyRepository implements ITechnologyRepository {
  constructor(
    @InjectRepository(TechnologyEntity)
    private readonly repo: Repository<TechnologyEntity>,
  ) {}

  async create(data: Partial<TechnologyEntity>): Promise<TechnologyEntity> {
    const Technology = this.repo.create(data);
    return this.repo.save(Technology);
  }

  async findAll(): Promise<TechnologyEntity[]> {
    return this.repo.find();
  }

  async update(
    id: number,
    data: Partial<TechnologyEntity>,
  ): Promise<TechnologyEntity> {
    await this.repo.update(id, data);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findOne(id: number): Promise<TechnologyEntity | null> {
    return this.repo.findOneBy({ id });
  }
}
