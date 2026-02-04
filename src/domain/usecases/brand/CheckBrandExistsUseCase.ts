// Use Case: Check if user has a brand
// Business logic for verifying brand existence

import { IBrandRepository } from '../../repositories/IBrandRepository';

export class CheckBrandExistsUseCase {
    constructor(private brandRepository: IBrandRepository) { }

    async execute(userId: string): Promise<boolean> {
        try {
            return await this.brandRepository.exists(userId);
        } catch (error) {
            console.error('Error checking brand existence:', error);
            // Fail open - assume brand exists to prevent blocking users
            return true;
        }
    }
}
