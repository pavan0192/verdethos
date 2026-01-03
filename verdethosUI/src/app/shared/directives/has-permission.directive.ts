import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { RbacService } from '../../services/rbac.service';
import { Permission } from '../../models/permission.model';

/**
 * Structural directive to conditionally render elements based on permissions
 * 
 * Usage:
 * <div *hasPermission="Permission.VIEW_PRODUCERS">Content</div>
 * <div *hasPermission="[Permission.VIEW_PRODUCERS, Permission.EDIT_PRODUCER]">Content</div>
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private rbacService = inject(RbacService);

  private hasView = false;
  private permissions: Permission[] = [];

  @Input() set hasPermission(permissions: Permission | Permission[]) {
    this.permissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  private updateView() {
    const hasPermission = this.rbacService.hasAnyPermission(this.permissions);
    
    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

