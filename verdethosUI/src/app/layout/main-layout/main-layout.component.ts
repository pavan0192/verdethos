import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { RoleSwitcherComponent } from '../../shared/components/role-switcher/role-switcher.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    RoleSwitcherComponent,
    RouterOutlet
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs() {
    const url = this.router.url;
    if (url.includes('/supplier-management/producers')) {
      this.breadcrumbs = [
        { label: 'Supplier Management', route: '/supplier-management' },
        { label: 'Producers', route: '/supplier-management/producers' }
      ];
    } else if (url.includes('/supplier-management/farms')) {
      this.breadcrumbs = [
        { label: 'Supplier Management', route: '/supplier-management' },
        { label: 'Farms', route: '/supplier-management/farms' }
      ];
    } else if (url.includes('/shipments')) {
      this.breadcrumbs = [
        { label: 'Shipments', route: '/shipments' }
      ];
    } else if (url.includes('/publish')) {
      this.breadcrumbs = [
        { label: 'Publish', route: '/publish' }
      ];
    } else if (url.includes('/inquiries')) {
      this.breadcrumbs = [
        { label: 'Inquiries', route: '/inquiries' }
      ];
    } else {
      this.breadcrumbs = [];
    }
  }
}

