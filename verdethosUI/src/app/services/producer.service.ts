import { Injectable, signal, computed } from '@angular/core';
import { 
  Producer, 
  ProducerListFilters, 
  PaginationParams, 
  PaginatedResponse,
  ProducerStatus,
  ProducerType 
} from '../models/producer.model';
import { mockProducers } from '../data/mock-producers';

@Injectable({
  providedIn: 'root'
})
export class ProducerService {
  // In-memory data store
  private producers = signal<Producer[]>(mockProducers);
  
  // Current filters
  private filters = signal<ProducerListFilters>({});
  
  // Current pagination
  private pagination = signal<PaginationParams>({ page: 1, pageSize: 10 });

  /**
   * Get filtered and paginated producers
   */
  getProducers(): PaginatedResponse<Producer> {
    const allProducers = this.producers();
    const filters = this.filters();
    const pagination = this.pagination();

    // Apply filters
    let filtered = [...allProducers];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(p => filters.status!.includes(p.status));
    }

    // EUDR filter
    if (filters.eudr !== undefined) {
      // Assuming EUDR: Yes means eudr value is not "0/4"
      if (filters.eudr) {
        filtered = filtered.filter(p => p.eudr !== '0/4');
      } else {
        filtered = filtered.filter(p => p.eudr === '0/4');
      }
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(p => filters.type!.includes(p.type));
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.pageSize);
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages
    };
  }

  /**
   * Get producer by ID
   */
  getProducerById(id: string): Producer | undefined {
    return this.producers().find(p => p.id === id);
  }

  /**
   * Set filters
   */
  setFilters(filters: ProducerListFilters) {
    this.filters.set(filters);
    // Reset to first page when filters change
    this.pagination.set({ ...this.pagination(), page: 1 });
  }

  /**
   * Update pagination
   */
  setPagination(pagination: PaginationParams) {
    this.pagination.set(pagination);
  }

  /**
   * Get current filters
   */
  getFilters() {
    return this.filters.asReadonly();
  }

  /**
   * Get current pagination
   */
  getPagination() {
    return this.pagination.asReadonly();
  }

  /**
   * Get counts by status
   */
  getStatusCounts() {
    const producers = this.producers();
    const inProcessing = producers.filter(p => 
      p.status === ProducerStatus.CREATED || p.status === ProducerStatus.IN_REVIEW
    ).length;
    const approved = producers.filter(p => 
      p.status === ProducerStatus.APPROVED
    ).length;
    
    return {
      inProcessing,
      approved
    };
  }

  /**
   * Create a new producer
   */
  createProducer(producer: Omit<Producer, 'id' | 'createdAt' | 'updatedAt'>): Producer {
    const newProducer: Producer = {
      ...producer,
      id: `producer-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.producers.set([...this.producers(), newProducer]);
    return newProducer;
  }

  /**
   * Update a producer
   */
  updateProducer(id: string, updates: Partial<Producer>): Producer | null {
    const producers = this.producers();
    const index = producers.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    const updated: Producer = {
      ...producers[index],
      ...updates,
      updatedAt: new Date()
    };

    const newProducers = [...producers];
    newProducers[index] = updated;
    this.producers.set(newProducers);
    
    return updated;
  }

  /**
   * Delete a producer
   */
  deleteProducer(id: string): boolean {
    const producers = this.producers();
    const filtered = producers.filter(p => p.id !== id);
    
    if (filtered.length === producers.length) {
      return false; // Producer not found
    }

    this.producers.set(filtered);
    return true;
  }

  /**
   * Update producer status (for review action)
   */
  updateProducerStatus(id: string, status: ProducerStatus): Producer | null {
    return this.updateProducer(id, { status });
  }
}

