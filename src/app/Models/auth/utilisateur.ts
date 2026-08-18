
export type UserRole = 'citoyen' | 'agent';

export interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name: string;
  telephone?: string;
  email: string;
  role: UserRole;
}
