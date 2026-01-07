import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RbacService } from '../../services/rbac.service';
import { Permission } from '../../models/permission.model';
import { HasPermissionDirective } from '../../shared/directives/has-permission.directive';
import { RoleSwitcherComponent } from '../../shared/components/role-switcher/role-switcher.component';

interface MenuItem {
  label: string;
  route: string;
  permission: Permission;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective, RoleSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private rbacService: RbacService) {}

  // Main menu items with permissions
  menuItems: MenuItem[] = [
    { label: 'Supplier Management', route: '/supplier-management', permission: Permission.VIEW_SUPPLIER_MANAGEMENT },
    { label: 'Shipments', route: '/shipments', permission: Permission.VIEW_SHIPMENTS },
    { label: 'Publish', route: '/publish', permission: Permission.VIEW_PUBLISH },
    { label: 'Inquiries', route: '/inquiries', permission: Permission.VIEW_INQUIRIES }
  ];

  // Get current user
  get currentUser() {
    return this.rbacService.getCurrentUser()();
  }

  // Check if menu item is active (simplified - would use router in real app)
  isActive(route: string): boolean {
    // This would check against current route in production
    return route === '/supplier-management';
  }
}

