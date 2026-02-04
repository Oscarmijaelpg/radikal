// Repository Interface: Brand
// Defines contract for data access, independent of implementation

import { Brand, BrandDiagnostic, CreateBrandDTO, UpdateBrandDTO } from '../entities/Brand';

export interface IBrandRepository {
    /**
     * Get brand by user ID
     */
    getByUserId(userId: string): Promise<Brand | null>;

    /**
     * Get brand by ID
     */
    getById(brandId: string): Promise<Brand | null>;

    /**
     * Create a new brand
     */
    create(userId: string, data: CreateBrandDTO): Promise<Brand>;

    /**
     * Update brand information
     */
    update(brandId: string, data: UpdateBrandDTO): Promise<Brand>;

    /**
     * Check if user has a brand
     */
    exists(userId: string): Promise<boolean>;

    /**
     * Get brand diagnostic data
     */
    getDiagnostic(brandId: string): Promise<BrandDiagnostic | null>;

    /**
     * Update diagnostic data
     */
    updateDiagnostic(brandId: string, data: Partial<BrandDiagnostic>): Promise<void>;
}
