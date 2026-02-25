import { useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { Badge, Spinner } from "@/components";

import type { AuditResponse } from "../dtos/response/audit.response";

interface AuditTableProps {
  audits: AuditResponse[];
  isLoading: boolean;
}

export function AuditTable({ audits, isLoading }: AuditTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-bg-card p-10 text-center text-text-muted text-sm">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-subtle">
      <table className="w-full text-sm">
        <thead className="bg-bg-canvas text-text-muted">
          <tr>
            <th className="w-8 px-2 py-3" />
            <th className="text-left px-4 py-3 font-medium">Criado em</th>
            <th className="text-left px-4 py-3 font-medium">Agent</th>
            <th className="text-left px-4 py-3 font-medium">Tipo</th>
            <th className="text-left px-4 py-3 font-medium">Tool</th>
            <th className="text-left px-4 py-3 font-medium">Tokens</th>
            <th className="text-left px-4 py-3 font-medium">Modelo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {audits.map((audit) => (
            <>
              <tr
                key={audit.id}
                onClick={() => toggleExpand(audit.id)}
                className="bg-bg-card hover:bg-brand-50 cursor-pointer transition-colors"
              >
                <td className="px-2 py-3 text-text-muted">
                  {expandedId === audit.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </td>
                <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                  {formatDate(audit.created_at)}
                </td>
                <td className="px-4 py-3 font-medium text-text-main">{audit.agent_name}</td>
                <td className="px-4 py-3">
                  <Badge variant={audit.event_type === "tool" ? "info" : "success"}>
                    {audit.event_type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-muted">{audit.tool_name || "-"}</td>
                <td className="px-4 py-3 text-text-muted">
                  {audit.tokens_used.toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-text-muted">{audit.model_used || "-"}</td>
              </tr>
              {expandedId === audit.id && (
                <tr key={`${audit.id}-detail`} className="bg-bg-canvas">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {audit.user_message && (
                        <div>
                          <p className="font-medium text-text-main mb-1">Mensagem do Usuário</p>
                          <p className="text-text-muted whitespace-pre-wrap bg-bg-card rounded-lg p-3 border border-border-subtle">
                            {audit.user_message}
                          </p>
                        </div>
                      )}
                      {audit.agent_response && (
                        <div>
                          <p className="font-medium text-text-main mb-1">Resposta do Agent</p>
                          <p className="text-text-muted whitespace-pre-wrap bg-bg-card rounded-lg p-3 border border-border-subtle">
                            {audit.agent_response}
                          </p>
                        </div>
                      )}
                      {audit.tool_input && Object.keys(audit.tool_input).length > 0 && (
                        <div>
                          <p className="font-medium text-text-main mb-1">Tool Input</p>
                          <pre className="text-text-muted whitespace-pre-wrap bg-bg-card rounded-lg p-3 border border-border-subtle font-mono text-xs overflow-auto max-h-48">
                            {JSON.stringify(audit.tool_input, null, 2)}
                          </pre>
                        </div>
                      )}
                      {audit.tool_output && (
                        <div>
                          <p className="font-medium text-text-main mb-1">Tool Output</p>
                          <pre className="text-text-muted whitespace-pre-wrap bg-bg-card rounded-lg p-3 border border-border-subtle font-mono text-xs overflow-auto max-h-48">
                            {audit.tool_output}
                          </pre>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-text-main mb-1">Tokens</p>
                        <p className="text-text-muted text-xs">
                          Prompt: {audit.prompt_tokens.toLocaleString("pt-BR")} | Completion:{" "}
                          {audit.completion_tokens.toLocaleString("pt-BR")} | Total:{" "}
                          {audit.tokens_used.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
