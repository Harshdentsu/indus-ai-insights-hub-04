
export type UserRole = 'dealer' | 'sales_rep' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  region?: string;
  dealerId?: string;
}

export interface LoginCredentials {
  username: string;
  role: UserRole;
}
