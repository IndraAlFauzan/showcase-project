import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { QueryFailedError } from 'typeorm';
import { IInterestRepository } from '../../infrastructure/repositories/interest.repository.interface';
import { CreateInterestDto } from '../../presentation/dto/create-interest.dto';

@Injectable()
export class CreateInterestUseCase {
  constructor(
    @Inject('IInterestRepository')
    private readonly repo: IInterestRepository,
  ) {}

  async execute(dto: CreateInterestDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Interest sudah ada');
      }
      throw error;
    }
  }
}
