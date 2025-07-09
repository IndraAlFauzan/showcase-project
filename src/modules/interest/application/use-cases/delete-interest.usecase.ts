import { Inject, Injectable } from '@nestjs/common';
import { IInterestRepository } from '../../infrastructure/repositories/interest.repository.interface';

@Injectable()
export class DeleteInterestUseCase {
  constructor(
    @Inject('IInterestRepository')
    private readonly interestRepository: IInterestRepository,
  ) {}

  async execute(id: number): Promise<void> {
    // Check if the interest exists
    const interest = await this.interestRepository.findOne(id);
    if (!interest) {
      throw new Error(`Category with id ${id} not found`);
    }
    // Proceed to delete the category
    await this.interestRepository.delete(id);
    console.log(`Interest with id ${id} deleted successfully`);
    return;
  }
}
