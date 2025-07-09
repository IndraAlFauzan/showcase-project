import { Inject, Injectable } from '@nestjs/common';
import { IInterestRepository } from '../../infrastructure/repositories/interest.repository.interface';
import { InterestEntity } from '../../domain/entities/interest.entity';

@Injectable()
export class GetAllInterestUseCase {
  constructor(
    @Inject('IInterestRepository')
    private readonly interestRepository: IInterestRepository,
  ) {}

  async execute(): Promise<InterestEntity[]> {
    // Fetch all interest from the repository
    const interest = await this.interestRepository.findAll();

    // If no interest found, return an empty array
    if (!interest || interest.length === 0) {
      return [];
    }

    // Return the list of interest
    return interest;
  }
}
