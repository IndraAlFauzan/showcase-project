import { Inject, Injectable } from '@nestjs/common';
import { IInterestRepository } from '../../infrastructure/repositories/interest.repository.interface';
import { InterestEntity } from '../../domain/entities/interest.entity';

@Injectable()
export class UpdateInterestUseCase {
  constructor(
    @Inject('IInterestRepository')
    private readonly interestRepository: IInterestRepository,
  ) {}

  async execute(
    id: number,
    data: Partial<InterestEntity>,
  ): Promise<InterestEntity> {
    // Check if the interest exists
    const interest = await this.interestRepository.findOne(id);
    if (!interest) {
      throw new Error(`interest with id ${id} not found`);
    }

    // Proceed to update the interest
    return this.interestRepository.update(id, data);
  }
}
