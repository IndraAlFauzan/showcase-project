import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IExpertiseRepository } from '../../infrastructure/repositories/expertise.repository.interface';
import { UpdateExpertiseDto } from '../../presentation/dto/update-expertrise.dto';
import { ExpertiseEntity } from '../../domain/entities/expertise.entity';

@Injectable()
export class UpdateExpertiseUseCase {
  constructor(
    @Inject('IExpertiseRepository')
    private readonly repo: IExpertiseRepository,
  ) {}

  async execute(
    id: number,
    dto: Partial<UpdateExpertiseDto>,
  ): Promise<ExpertiseEntity> {
    // Check if expertise exists
    const expertise = await this.repo.findOne(id);
    if (!expertise) {
      throw new NotFoundException(`Expertise dengan ID ${id} tidak ditemukan`);
    }

    // Update the expertise
    return this.repo.update(id, dto);
  }
}
