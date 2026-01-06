import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProducerService } from '../../services/producer.service';
import { RbacService } from '../../services/rbac.service';
import { Producer, ProducerStatus } from '../../models/producer.model';
import { StatusTabsComponent, StatusTab } from '../../shared/components/status-tabs/status-tabs.component';
import { SearchFilterComponent } from '../../shared/components/search-filter/search-filter.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { KebabMenuComponent, KebabMenuItem } from '../../shared/components/kebab-menu/kebab-menu.component';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'app-producer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusTabsComponent,
    SearchFilterComponent,
    PaginationComponent,
    KebabMenuComponent
  ],
  templateUrl: './producer-list.component.html',
  styleUrl: './producer-list.component.css'
})
export class ProducerListComponent implements OnInit {
  // Data
  producers = signal<Producer[]>([]);
  totalItems = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);

  // Filters
  searchValue = signal<string>('');
  activeStatusTab = signal<string>('in-processing');
  activeFilters = signal<Array<{ label: string; value: string }>>([]);

  // Status tabs
  statusTabs = computed<StatusTab[]>(() => {
    const counts = this.producerService.getStatusCounts();
    return [
      { label: 'In-processing', value: 'in-processing', count: counts.inProcessing },
      { label: 'Approved', value: 'approved', count: counts.approved }
    ];
  });

  // Table columns
  tableColumns = [
    { key: 'name', label: 'Producer Name', sortable: true },
    { key: 'type', label: 'Producer Type', sortable: true },
    { key: 'numberOfFarms', label: '# of Farms', sortable: true },
    { key: 'serasa', label: 'Serasa', sortable: false },
    { key: 'eudr', label: 'EUDR', sortable: false },
    { key: 'status', label: 'Status', sortable: true }
  ];

  constructor(
    private producerService: ProducerService,
    private rbacService: RbacService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Reload data when navigating to this route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.includes('/supplier-management/producers')) {
          this.loadProducers();
        }
      });
  }

  ngOnInit() {
    this.loadProducers();
  }

  loadProducers() {
    // Apply status filter based on active tab
    const statusFilter: ProducerStatus[] = [];
    if (this.activeStatusTab() === 'in-processing') {
      statusFilter.push(ProducerStatus.CREATED, ProducerStatus.IN_REVIEW);
    } else if (this.activeStatusTab() === 'approved') {
      statusFilter.push(ProducerStatus.APPROVED);
    }

    // Set filters
    this.producerService.setFilters({
      search: this.searchValue() || undefined,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      eudr: this.activeFilters().find(f => f.value === 'eudr-yes') ? true : undefined
    });

    // Set pagination
    this.producerService.setPagination({
      page: this.currentPage(),
      pageSize: this.pageSize()
    });

    // Get producers
    const response = this.producerService.getProducers();
    this.producers.set(response.data);
    this.totalItems.set(response.total);
    this.totalPages.set(response.totalPages);
  }

  onTabChange(tabValue: string) {
    this.activeStatusTab.set(tabValue);
    this.currentPage.set(1);
    this.loadProducers();
  }

  onSearchChange(search: string) {
    this.searchValue.set(search);
    this.currentPage.set(1);
    this.loadProducers();
  }

  onRemoveFilter(filterValue: string) {
    const filters = this.activeFilters().filter(f => f.value !== filterValue);
    this.activeFilters.set(filters);
    this.loadProducers();
  }

  onOpenFilters() {
    // TODO: Open filter modal/dialog
    console.log('Open filters');
  }

  onOpenActions() {
    // TODO: Open actions menu
    console.log('Open actions');
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadProducers();
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadProducers();
  }

  getKebabMenuItems(producer: Producer): KebabMenuItem[] {
    const items: KebabMenuItem[] = [];
    const status = producer.status;

    // Review action (only for In Review status)
    if (this.rbacService.canPerformProducerAction('review', status)) {
      items.push({
        label: 'Review',
        action: 'review',
        icon: 'review',
        highlighted: true
      });
    }

    // View Details (always available if permission exists)
    if (this.rbacService.canPerformProducerAction('view', status)) {
      items.push({
        label: 'View Details',
        action: 'view',
        icon: 'view'
      });
    }

    // Edit (based on role + status)
    if (this.rbacService.canPerformProducerAction('edit', status)) {
      items.push({
        label: 'Edit',
        action: 'edit',
        icon: 'edit'
      });
    }

    // Delete (only Admin, only Created status)
    if (this.rbacService.canPerformProducerAction('delete', status)) {
      items.push({
        label: 'Delete',
        action: 'delete',
        icon: 'delete'
      });
    }

    return items;
  }

  onKebabAction(action: string, producer: Producer) {
    switch (action) {
      case 'view':
        // Navigate to detail page
        this.router.navigate(['/supplier-management/producers', producer.id]);
        break;
      case 'edit':
        // Navigate to edit page
        this.router.navigate(['/supplier-management/producers', producer.id, 'edit']);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${producer.name}?`)) {
          this.producerService.deleteProducer(producer.id);
          this.loadProducers();
        }
        break;
      case 'review':
        // Update status to approved
        this.producerService.updateProducerStatus(producer.id, ProducerStatus.APPROVED);
        this.loadProducers();
        break;
    }
  }

  getStatusClass(status: ProducerStatus): string {
    switch (status) {
      case ProducerStatus.CREATED:
        return 'status-created';
      case ProducerStatus.IN_REVIEW:
        return 'status-in-review';
      case ProducerStatus.APPROVED:
        return 'status-approved';
      case ProducerStatus.REJECTED:
        return 'status-rejected';
      default:
        return '';
    }
  }

  onAddProducer() {
    // Navigate to add producer page
    this.router.navigate(['/supplier-management/producers/new']);
  }

  canCreateProducer(): boolean {
    return this.rbacService.hasPermission(Permission.CREATE_PRODUCER);
  }
}

