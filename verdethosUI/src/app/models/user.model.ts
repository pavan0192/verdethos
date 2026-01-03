export enum UserRole {
  ADMIN = 'admin',
  COMPLIANCE = 'compliance',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

