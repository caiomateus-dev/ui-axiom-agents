export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface MeResponse {
  id: number;
  name: string;
  email: string;
}
