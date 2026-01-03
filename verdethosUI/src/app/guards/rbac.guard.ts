import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RbacService } from '../services/rbac.service';
import { Permission } from '../models/permission.model';

/**
 * RBAC Route Guard
 * Protects routes based on user permissions
 * 
 * Usage in routes:
 * {
 *   path: 'producers',
 *   component: ProducerListComponent,
 *   canActivate: [rbacGuard(Permission.VIEW_PRODUCERS)]
 * }
 */
export const rbacGuard = (requiredPermission: Permission): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const rbacService = inject(RbacService);
    const router = inject(Router);

    if (rbacService.hasPermission(requiredPermission)) {
      return true;
    }

    // Redirect to unauthorized or home page
    router.navigate(['/']);
    return false;
  };
};

