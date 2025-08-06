import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/repositories/project.repository.interface';

@Injectable()
export class SetTopProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  async execute(id: number, isTop: boolean): Promise<void> {
    const existing = await this.projectRepo.findById(id);
    if (!existing) throw new NotFoundException('Project tidak ditemukan');

    await this.projectRepo.setTopProject(id, isTop);
  }
}
