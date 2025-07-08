import { Inject, Injectable } from '@nestjs/common';
import { TechnologyEntity } from '../../domain/entities/technology.entity';
import { ITechnologyRepository } from '../../infrastructure/repositories/technology.repository.interface';

@Injectable()
export class UpdateTechnologyUseCase {
  constructor(
    @Inject('ITechnologyRepository')
    private readonly technologyRepository: ITechnologyRepository,
  ) {}

  async execute(
    id: number,
    data: Partial<TechnologyEntity>,
  ): Promise<TechnologyEntity> {
    const technology = await this.technologyRepository.findOne(id);
    if (!technology) {
      throw new Error(`technology with id ${id} not found`);
    }

    return this.technologyRepository.update(id, data);
  }
}
