import { useState } from "react";

import type { HandoffSessionItem } from "../dtos/response/handoff.response";
import { useHandoffSessions, useReleaseHandoff } from "./use-handoff";

export function useHandoffPage() {
  const [releasingSession, setReleasingSession] = useState<HandoffSessionItem | null>(null);

  const { data, isLoading, isError } = useHandoffSessions();
  const releaseMutation = useReleaseHandoff();

  function handleOpenRelease(session: HandoffSessionItem) {
    setReleasingSession(session);
  }

  function handleCloseRelease() {
    setReleasingSession(null);
  }

  async function handleConfirmRelease() {
    if (!releasingSession) return;
    await releaseMutation.mutateAsync({
      agentId: releasingSession.agent_id,
      sessionId: releasingSession.session_id,
    });
    setReleasingSession(null);
  }

  return {
    sessions: data?.sessions ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    releasingSession,
    handleOpenRelease,
    handleCloseRelease,
    handleConfirmRelease,
    isReleasing: releaseMutation.isPending,
  };
}
