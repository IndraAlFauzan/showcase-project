import { Inject, Injectable } from '@nestjs/common';
import { ITechnologyRepository } from '../../infrastructure/repositories/technology.repository.interface';

@Injectable()
export class DeleteTechnologyUseCase {
  constructor(
    @Inject('ITechnologyRepository')
    private readonly technologyRepository: ITechnologyRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const technology = await this.technologyRepository.findOne(id);
    if (!technology) {
      throw new Error(`technology with id ${id} not found`);
    }

    await this.technologyRepository.delete(id);
    console.log(`technology with id ${id} deleted successfully`);
    return;
  }
}
