import { Routes } from '@angular/router';
import { ProducerListComponent } from './pages/producer-list/producer-list.component';
import { rbacGuard } from './guards/rbac.guard';
import { Permission } from './models/permission.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/supplier-management/producers',
    pathMatch: 'full'
  },
  {
    path: 'supplier-management',
    children: [
      {
        path: 'producers',
        component: ProducerListComponent,
        canActivate: [rbacGuard(Permission.VIEW_PRODUCERS)]
      },
      {
        path: 'farms',
        loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Farms', permission: Permission.VIEW_FARMS },
        canActivate: [rbacGuard(Permission.VIEW_FARMS)]
      }
    ]
  },
  {
    path: 'shipments',
    loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
    data: { title: 'Shipments', permission: Permission.VIEW_SHIPMENTS },
    canActivate: [rbacGuard(Permission.VIEW_SHIPMENTS)]
  },
  {
    path: 'publish',
    loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
    data: { title: 'Publish', permission: Permission.VIEW_PUBLISH },
    canActivate: [rbacGuard(Permission.VIEW_PUBLISH)]
  },
  {
    path: 'inquiries',
    loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
    data: { title: 'Inquiries', permission: Permission.VIEW_INQUIRIES },
    canActivate: [rbacGuard(Permission.VIEW_INQUIRIES)]
  }
];
