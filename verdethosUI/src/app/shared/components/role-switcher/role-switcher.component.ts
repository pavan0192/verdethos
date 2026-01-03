import { Component, OnInit, computed, effect } from '@angular/core';
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
export class RoleSwitcherComponent implements OnInit {
  roles = [
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.COMPLIANCE, label: 'Compliance' },
    { value: UserRole.VIEWER, label: 'Viewer' }
  ];

  // Computed signal that always reflects the current user's role
  currentRole = computed(() => this.rbacService.getCurrentUser()().role);

  constructor(private rbacService: RbacService) {
    // Ensure we're reading from the service which reads from localStorage
    // The computed signal will automatically update when the user changes
  }

  ngOnInit() {
    // Verify the role is correctly loaded from localStorage
    const currentUserRole = this.rbacService.getCurrentUser()().role;
    console.log('Role Switcher initialized with role:', currentUserRole);
    
    // Double-check localStorage
    const savedRole = localStorage.getItem('demo_user_role');
    if (savedRole && savedRole !== currentUserRole) {
      console.warn('Mismatch: localStorage has', savedRole, 'but service has', currentUserRole);
      // Sync them
      const currentUser = this.rbacService.getCurrentUser()();
      this.rbacService.setCurrentUser({
        ...currentUser,
        role: savedRole as UserRole
      });
    }
  }

  onRoleChange(role: UserRole) {
    const currentUser = this.rbacService.getCurrentUser()();
    const updatedUser = {
      ...currentUser,
      role
    };
    
    // Save to localStorage first
    try {
      localStorage.setItem('demo_user_role', role);
      console.log('Role saved to localStorage:', role);
    } catch (e) {
      console.warn('Failed to save role to localStorage:', e);
    }
    
    // Update the service (this will trigger signal update)
    this.rbacService.setCurrentUser(updatedUser);
    console.log('Role updated in service:', role);
    
    // Reload after a brief delay to ensure localStorage is saved
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}

