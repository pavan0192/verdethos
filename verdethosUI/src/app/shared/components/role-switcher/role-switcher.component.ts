import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RbacService } from '../../../services/rbac.service';
import { UserRole } from '../../../models/user.model';

/**
 * Role Switcher Component
 * For testing/demo purposes - allows switching between roles to test RBAC
 * In production, this would be removed or only available to admins
 */
@Component({
  selector: 'app-role-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-switcher.component.html',
  styleUrl: './role-switcher.component.css'
})
export class RoleSwitcherComponent {
  currentRole: UserRole;
  roles = [
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.COMPLIANCE, label: 'Compliance' },
    { value: UserRole.VIEWER, label: 'Viewer' }
  ];

  constructor(private rbacService: RbacService) {
    this.currentRole = rbacService.getCurrentUser()().role;
  }

  onRoleChange(role: UserRole) {
    const currentUser = this.rbacService.getCurrentUser()();
    this.rbacService.setCurrentUser({
      ...currentUser,
      role
    });
    this.currentRole = role;
    
    // Reload the page to reflect permission changes
    window.location.reload();
  }
}

