import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RbacService } from '../../services/rbac.service';
import { Permission } from '../../models/permission.model';
import { HasPermissionDirective } from '../../shared/directives/has-permission.directive';

interface SidebarItem {
  label: string;
  route: string;
  permission: Permission;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private rbacService: RbacService) {}

  // Sidebar menu items with permissions
  menuItems: SidebarItem[] = [
    { 
      label: 'Producers', 
      route: '/supplier-management/producers', 
      permission: Permission.VIEW_PRODUCERS 
    },
    { 
      label: 'Farms', 
      route: '/supplier-management/farms', 
      permission: Permission.VIEW_FARMS 
    }
  ];

  // Check if item is active (simplified - would use router in real app)
  isActive(route: string): boolean {
    // This would check against current route in production
    return route === '/supplier-management/producers';
  }
}

