import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IExpertiseRepository } from '../../infrastructure/repositories/expertise.repository.interface';

@Injectable()
export class DeleteExpertiseUseCase {
  constructor(
    @Inject('IExpertiseRepository')
    private readonly repo: IExpertiseRepository,
  ) {}

  async execute(id: number): Promise<void> {
    // Check if expertise exists
    const expertise = await this.repo.findOne(id);
    if (!expertise) {
      throw new NotFoundException(`Expertise dengan ID ${id} tidak ditemukan`);
    }

    // Delete the expertise
    await this.repo.delete(id);
  }
}
