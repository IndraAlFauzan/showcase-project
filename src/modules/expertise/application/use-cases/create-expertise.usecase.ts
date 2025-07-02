import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IExpertiseRepository } from '../../infrastructure/repositories/expertise.repository.interface';
import { QueryFailedError } from 'typeorm';
import { CreateExpertiseDto } from '../../presentation/dto/create-expertrise.dto';

@Injectable()
export class CreateExpertiseUseCase {
  constructor(
    @Inject('IExpertiseRepository')
    private readonly repo: IExpertiseRepository,
  ) {}

  async execute(dto: CreateExpertiseDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Expertise Sudah Ada');
      }
      throw error;
    }
  }
}
