import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOrganization,
  deleteOrganization,
  inviteMember,
  listMembers,
  listOrganizations,
  removeMember,
  updateOrganization,
} from "../api";
import type { InviteMemberFormData } from "../dtos/request/organization.schema";
import type { UpdateOrganizationFormData } from "../dtos/request/organization.schema";

export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: listOrganizations,
  });
}

export function useOrganizationMembers(orgId: number | null) {
  return useQuery({
    queryKey: ["organization-members", orgId],
    queryFn: () => listMembers(orgId!),
    enabled: orgId !== null,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrganizationFormData }) =>
      updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: number; data: InviteMemberFormData }) =>
      inviteMember(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, userId }: { orgId: number; userId: number }) =>
      removeMember(orgId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
