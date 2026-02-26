export interface OrganizationResponse {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  members_count: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMemberResponse {
  id: number;
  organization_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
