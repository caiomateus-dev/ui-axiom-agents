import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createVectorStore } from "../api/create-vector-store";
import { deleteVectorStore } from "../api/delete-vector-store";
import { listVectorStores } from "../api/list-vector-stores";
import { updateVectorStore } from "../api/update-vector-store";

export function useVectorStores() {
  return useQuery({
    queryKey: ["vector-stores"],
    queryFn: listVectorStores,
  });
}

export function useCreateVectorStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVectorStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vector-stores"] });
    },
  });
}

export function useUpdateVectorStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateVectorStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vector-stores"] });
    },
  });
}

export function useDeleteVectorStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVectorStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vector-stores"] });
    },
  });
}
