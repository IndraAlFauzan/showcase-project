import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IStudentRepository } from '../../infrastructure/repositories/student.repository.interface';

@Injectable()
export class DeleteStudentProfileUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepo: IStudentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const found = await this.studentRepo.findById(id);
    if (!found) {
      throw new NotFoundException('Profil mahasiswa tidak ditemukan');
    }

    await this.studentRepo.delete(id);
  }
}
