// Infrastructure: Supabase Brand Repository
// Concrete implementation of IBrandRepository using Supabase

import { SupabaseClient } from '@supabase/supabase-js';
import { IBrandRepository } from '../../domain/repositories/IBrandRepository';
import { Brand, BrandDiagnostic, CreateBrandDTO, UpdateBrandDTO } from '../../domain/entities/Brand';

export class SupabaseBrandRepository implements IBrandRepository {
    constructor(private supabase: SupabaseClient) { }

    async getByUserId(userId: string): Promise<Brand | null> {
        const { data, error } = await this.supabase
            .from('brands')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            throw error;
        }

        return data;
    }

    async getById(brandId: string): Promise<Brand | null> {
        const { data, error } = await this.supabase
            .from('brands')
            .select('*')
            .eq('id', brandId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return data;
    }

    async create(userId: string, data: CreateBrandDTO): Promise<Brand> {
        const { data: brand, error } = await this.supabase
            .from('brands')
            .insert({
                user_id: userId,
                website: data.website,
                tax_id: data.tax_id,
                instagram: data.instagram,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return brand;
    }

    async update(brandId: string, data: UpdateBrandDTO): Promise<Brand> {
        const { data: brand, error } = await this.supabase
            .from('brands')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', brandId)
            .select()
            .single();

        if (error) throw error;
        return brand;
    }

    async exists(userId: string): Promise<boolean> {
        const { data, error } = await this.supabase
            .from('brands')
            .select('id')
            .eq('user_id', userId)
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return false;
            throw error;
        }

        return !!data;
    }

    async getDiagnostic(brandId: string): Promise<BrandDiagnostic | null> {
        const { data, error } = await this.supabase
            .from('initial_diagnostics')
            .select('*')
            .eq('brand_id', brandId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return data;
    }

    async updateDiagnostic(brandId: string, data: Partial<BrandDiagnostic>): Promise<void> {
        const { error } = await this.supabase
            .from('initial_diagnostics')
            .upsert(
                {
                    brand_id: brandId,
                    ...data,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'brand_id' }
            );

        if (error) throw error;
    }
}
