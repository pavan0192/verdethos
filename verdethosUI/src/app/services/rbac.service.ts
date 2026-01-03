import { Injectable, signal } from '@angular/core';
import { Permission, RolePermissions } from '../models/permission.model';
import { User, UserRole } from '../models/user.model';
import { ProducerStatus } from '../models/producer.model';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  // Mock current user - in production, this would come from auth service
  private currentUser = signal<User>(this.initializeUser());

  private initializeUser(): User {
    // Try to load role from localStorage (for testing/demo)
    let role = UserRole.ADMIN;
    
    try {
      const savedRole = localStorage.getItem('demo_user_role');
      if (savedRole && Object.values(UserRole).includes(savedRole as UserRole)) {
        role = savedRole as UserRole;
      }
    } catch (e) {
      console.warn('Failed to read role from localStorage:', e);
      // Default to ADMIN if localStorage is not available
    }

    return {
      id: '1',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: role,
      tenantId: 'tenant-1'
    };
  }

  // Permission mapping: Role -> Permissions
  private rolePermissions: Map<UserRole, Permission[]> = new Map([
    [UserRole.ADMIN, [
      Permission.VIEW_SUPPLIER_MANAGEMENT,
      Permission.VIEW_SHIPMENTS,
      Permission.VIEW_PUBLISH,
      Permission.VIEW_INQUIRIES,
      Permission.VIEW_PRODUCERS,
      Permission.CREATE_PRODUCER,
      Permission.EDIT_PRODUCER,
      Permission.DELETE_PRODUCER,
      Permission.REVIEW_PRODUCER,
      Permission.VIEW_PRODUCER_DETAILS,
      Permission.VIEW_FARMS
    ]],
    [UserRole.COMPLIANCE, [
      Permission.VIEW_SUPPLIER_MANAGEMENT,
      Permission.VIEW_PRODUCERS,
      Permission.EDIT_PRODUCER,
      Permission.REVIEW_PRODUCER,
      Permission.VIEW_PRODUCER_DETAILS,
      Permission.VIEW_FARMS
    ]],
    [UserRole.VIEWER, [
      Permission.VIEW_SUPPLIER_MANAGEMENT,
      Permission.VIEW_PRODUCERS,
      Permission.VIEW_PRODUCER_DETAILS,
      Permission.VIEW_FARMS
    ]]
  ]);

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  /**
   * Set current user (for testing/demo purposes)
   */
  setCurrentUser(user: User) {
    this.currentUser.set(user);
    // Save role to localStorage for persistence across page reloads
    localStorage.setItem('demo_user_role', user.role);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    const user = this.currentUser();
    const permissions = this.rolePermissions.get(user.role) || [];
    return permissions.includes(permission);
  }

  /**
   * Check if user has any of the provided permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Check if user has all of the provided permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Get all permissions for current user's role
   */
  getUserPermissions(): Permission[] {
    const user = this.currentUser();
    return this.rolePermissions.get(user.role) || [];
  }

  /**
   * Check if user can perform action on producer based on role and status
   * This implements the "Role + Status" logic for kebab menu actions
   */
  canPerformProducerAction(
    action: 'view' | 'edit' | 'delete' | 'review',
    producerStatus: ProducerStatus
  ): boolean {
    const user = this.currentUser();

    switch (action) {
      case 'view':
        return this.hasPermission(Permission.VIEW_PRODUCER_DETAILS);
      
      case 'edit':
        if (!this.hasPermission(Permission.EDIT_PRODUCER)) {
          return false;
        }
        // Can edit if status is Created or In Review
        return producerStatus === ProducerStatus.CREATED || 
               producerStatus === ProducerStatus.IN_REVIEW;
      
      case 'delete':
        if (!this.hasPermission(Permission.DELETE_PRODUCER)) {
          return false;
        }
        // Only Admin can delete, and only if status is Created
        return user.role === UserRole.ADMIN && 
               producerStatus === ProducerStatus.CREATED;
      
      case 'review':
        if (!this.hasPermission(Permission.REVIEW_PRODUCER)) {
          return false;
        }
        // Can review if status is In Review
        return producerStatus === ProducerStatus.IN_REVIEW;
      
      default:
        return false;
    }
  }

  /**
   * Check if user can access a route
   */
  canAccessRoute(requiredPermission: Permission): boolean {
    return this.hasPermission(requiredPermission);
  }
}

