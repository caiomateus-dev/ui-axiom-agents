import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listHandoffSessions, releaseHandoffSession } from "../api";
import type { ReleaseHandoffPayload } from "../api";

export function useHandoffSessions(agentName?: string) {
  return useQuery({
    queryKey: ["handoff-sessions", agentName],
    queryFn: () => listHandoffSessions(agentName),
    refetchInterval: 10_000,
  });
}

export function useReleaseHandoff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReleaseHandoffPayload) => releaseHandoffSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoff-sessions"] });
    },
  });
}
