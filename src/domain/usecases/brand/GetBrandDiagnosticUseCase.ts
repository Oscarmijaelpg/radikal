// Use Case: Get brand diagnostic data
// Business logic for retrieving diagnostic information

import { IBrandRepository } from '../../repositories/IBrandRepository';
import { BrandDiagnostic } from '../../entities/Brand';

export class GetBrandDiagnosticUseCase {
    constructor(private brandRepository: IBrandRepository) { }

    async execute(brandId: string): Promise<BrandDiagnostic | null> {
        if (!brandId) {
            throw new Error('Brand ID is required');
        }

        return await this.brandRepository.getDiagnostic(brandId);
    }
}
