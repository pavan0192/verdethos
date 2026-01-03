export enum ProducerType {
  FARM_GROUP = 'Farm Group',
  INDIVIDUAL = 'Individual',
  COOPERATIVE = 'Cooperative'
}

export enum ProducerStatus {
  CREATED = 'Created',
  IN_REVIEW = 'In Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Producer {
  id: string;
  name: string;
  type: ProducerType;
  numberOfFarms: number;
  serasa: string; // Format: "1/4"
  eudr: string; // Format: "1/4"
  status: ProducerStatus;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProducerListFilters {
  search?: string;
  status?: ProducerStatus[];
  eudr?: boolean;
  type?: ProducerType[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

