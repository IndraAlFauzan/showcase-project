import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { QueryFailedError } from 'typeorm';
import { ITechnologyRepository } from '../../infrastructure/repositories/technology.repository.interface';
import { CreateTechnologyDto } from '../../presentation/dto/create-technology.dto';

@Injectable()
export class CreateTechnologyUseCase {
  constructor(
    @Inject('ITechnologyRepository')
    private readonly repo: ITechnologyRepository,
  ) {}

  async execute(dto: CreateTechnologyDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Technology sudah ada');
      }
      throw error;
    }
  }
}
