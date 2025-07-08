import { Inject, Injectable } from '@nestjs/common';
import { ITechnologyRepository } from '../../infrastructure/repositories/technology.repository.interface';
import { TechnologyEntity } from '../../domain/entities/technology.entity';

@Injectable()
export class GetAllTechnologyUseCase {
  constructor(
    @Inject('ITechnologyRepository')
    private readonly technologyRepository: ITechnologyRepository,
  ) {}

  async execute(): Promise<TechnologyEntity[]> {
    const technology = await this.technologyRepository.findAll();

    if (!technology || technology.length === 0) {
      return [];
    }

    return technology;
  }
}
