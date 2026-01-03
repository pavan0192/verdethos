import { Pipe, PipeTransform, inject } from '@angular/core';
import { RbacService } from '../../services/rbac.service';
import { Permission } from '../../models/permission.model';

/**
 * Pipe for checking permissions in templates
 * 
 * Usage:
 * {{ Permission.VIEW_PRODUCERS | hasPermission }}
 * 
 * Or with multiple permissions (OR logic):
 * {{ [Permission.VIEW_PRODUCERS, Permission.EDIT_PRODUCER] | hasPermission }}
 */
@Pipe({
  name: 'hasPermission',
  standalone: true
})
export class HasPermissionPipe implements PipeTransform {
  private rbacService = inject(RbacService);

  transform(permissions: Permission | Permission[]): boolean {
    if (Array.isArray(permissions)) {
      return this.rbacService.hasAnyPermission(permissions);
    }
    return this.rbacService.hasPermission(permissions);
  }
}

