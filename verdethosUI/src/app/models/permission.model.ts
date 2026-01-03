export enum Permission {
  // Main menu permissions
  VIEW_SUPPLIER_MANAGEMENT = 'view:supplier-management',
  VIEW_SHIPMENTS = 'view:shipments',
  VIEW_PUBLISH = 'view:publish',
  VIEW_INQUIRIES = 'view:inquiries',
  
  // Producer permissions
  VIEW_PRODUCERS = 'view:producers',
  CREATE_PRODUCER = 'create:producer',
  EDIT_PRODUCER = 'edit:producer',
  DELETE_PRODUCER = 'delete:producer',
  REVIEW_PRODUCER = 'review:producer',
  VIEW_PRODUCER_DETAILS = 'view:producer-details',
  
  // Farm permissions
  VIEW_FARMS = 'view:farms'
}

export interface RolePermissions {
  role: string;
  permissions: Permission[];
}

