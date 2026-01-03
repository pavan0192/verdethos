import { Injectable, signal } from '@angular/core';

/**
 * Tenant Service
 * Manages tenant isolation in a multi-tenant B2B SaaS platform
 * In production, tenant ID would come from JWT token or session
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  // Mock current tenant - in production, this would come from auth service
  private currentTenantId = signal<string>('tenant-1');

  /**
   * Get current tenant ID
   */
  getCurrentTenantId(): string {
    return this.currentTenantId();
  }

  /**
   * Set tenant ID (for testing/demo purposes)
   */
  setTenantId(tenantId: string) {
    this.currentTenantId.set(tenantId);
  }

  /**
   * Check if resource belongs to current tenant
   */
  belongsToCurrentTenant(resourceTenantId: string): boolean {
    return resourceTenantId === this.currentTenantId();
  }
}

