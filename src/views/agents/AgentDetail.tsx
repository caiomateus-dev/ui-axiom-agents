import { useNavigate, useParams } from "react-router";

import { ArrowLeft } from "lucide-react";

import { Badge, Button, Spinner } from "@/components";

import { formatDateTime } from "@/utils";

import { useAgent } from "./hooks/use-agents";

export function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: agent, isLoading, isError } = useAgent(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-error-border bg-error-bg p-4 text-error-text text-sm">
          Erro ao carregar detalhes do agent.
        </div>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/agents")}>
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/agents")}>
        <ArrowLeft className="w-4 h-4" />
        Voltar para Agents
      </Button>

      <div className="rounded-lg border border-border-subtle bg-bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-main">{agent.name}</h1>
          <Badge variant={agent.is_active ? "success" : "error"}>
            {agent.is_active ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-1">Descrição</h3>
            <p className="text-sm text-text-main">{agent.description || "Sem descrição"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-muted mb-1">Criado em</h3>
            <p className="text-sm text-text-main">{formatDateTime(agent.created_at)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-muted mb-1">Atualizado em</h3>
            <p className="text-sm text-text-main">{formatDateTime(agent.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
