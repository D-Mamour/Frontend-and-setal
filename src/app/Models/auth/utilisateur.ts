
export type UserRole = 'citoyen' | 'agent' | 'admin';

export interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name: string;
  telephone?: string;
  email: string;
  role: UserRole;
  is_active?: boolean;
  last_login?: string | null;
}
