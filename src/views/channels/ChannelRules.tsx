import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Hash, Plus, Shuffle, Trash2 } from "lucide-react";

import { useToast } from "@/contexts/ToastContext";

import { Badge, Button, Input, Modal, Select, SlidePanel, TagInput, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { useAgents } from "@/views/agents/hooks/use-agents";

import type { RuleFormData } from "./dtos/request/channel.schema";
import { ruleSchema } from "./dtos/request/channel.schema";
import type { RuleResponse } from "./dtos/response/channel.response";
import { useChannelRules, useCreateRule, useDeleteRule, useUpdateRule } from "./hooks";

const RULE_TYPES = [
  {
    value: "default",
    label: "Padrão",
    icon: Shuffle,
    description:
      "Atende 24h, todos os dias. Usado quando nenhuma outra regra se aplica à mensagem recebida.",
  },
  {
    value: "schedule",
    label: "Horário",
    icon: Calendar,
    description:
      "Atende apenas nos dias e horários definidos. Ideal para direcionar para um agente humano durante o horário comercial e um bot fora dele.",
  },
  {
    value: "keyword",
    label: "Palavra-chave",
    icon: Hash,
    description:
      "Atende quando a mensagem contiver alguma das palavras definidas. Ex: 'cancelar', 'urgente', 'suporte'.",
  },
] as const;

type RuleTypeValue = (typeof RULE_TYPES)[number]["value"];

const RULE_TYPE_LABELS: Record<RuleTypeValue, string> = Object.fromEntries(
  RULE_TYPES.map((r) => [r.value, r.label]),
) as Record<RuleTypeValue, string>;

interface ChannelRulesProps {
  channelId: number;
}

export function ChannelRules({ channelId }: ChannelRulesProps) {
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingRule, setDeletingRule] = useState<RuleResponse | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  const { data: rules, isLoading, isError } = useChannelRules(channelId);
  const { data: agents } = useAgents();
  const createRule = useCreateRule(channelId);
  const updateRule = useUpdateRule(channelId);
  const deleteRule = useDeleteRule(channelId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: { rule_type: "default", order_index: 0, is_active: true },
  });

  const ruleType = watch("rule_type") as RuleTypeValue;

  function handleOpenCreate() {
    reset({ rule_type: "default", order_index: rules?.length ?? 0, is_active: true });
    setKeywords([]);
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    reset();
    setKeywords([]);
  }

  const onCreateSubmit = handleSubmit(async (data) => {
    let condition: Record<string, unknown> = {};
    if (data.rule_type === "keyword") {
      condition = { keywords };
    } else if (data.rule_type === "schedule") {
      condition = data.condition ?? {};
    }
    // default rules always go last
    const order_index = data.rule_type === "default" ? 999 : data.order_index;
    try {
      await createRule.mutateAsync({ ...data, order_index, condition });
      toast.success("Regra criada com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar regra");
    }
  });

  async function handleToggleActive(rule: RuleResponse) {
    try {
      await updateRule.mutateAsync({ ruleId: rule.id, data: { is_active: !rule.is_active } });
    } catch {
      toast.error("Erro ao atualizar regra");
    }
  }

  async function handleDelete() {
    if (!deletingRule) return;
    try {
      await deleteRule.mutateAsync(deletingRule.id);
      toast.success("Regra removida");
      setDeletingRule(null);
    } catch {
      toast.error("Erro ao remover regra");
    }
  }

  function agentName(agentId: number) {
    return agents?.find((a) => a.id === agentId)?.name ?? String(agentId);
  }

  const columns: ColumnDef<RuleResponse>[] = [
    {
      id: "order",
      header: "Prioridade",
      accessor: (row) =>
        row.rule_type === "default" ? (
          <span className="text-text-muted text-xs">—</span>
        ) : (
          <span className="text-text-muted font-mono text-xs">{row.order_index}</span>
        ),
    },
    {
      id: "rule_type",
      header: "Tipo",
      accessor: (row) => (
        <Badge variant="info">{RULE_TYPE_LABELS[row.rule_type as RuleTypeValue]}</Badge>
      ),
    },
    {
      id: "agent",
      header: "Agente",
      accessor: (row) => (
        <span className="font-medium text-text-main">{agentName(row.agent_id)}</span>
      ),
    },
    {
      id: "condition",
      header: "Condição",
      accessor: (row) => {
        if (row.rule_type === "schedule") {
          const c = row.condition as { days?: number[]; start?: string; end?: string };
          const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
          const days = (c.days ?? []).map((d) => DAY_LABELS[d]).join(", ");
          return (
            <span className="text-text-muted text-xs">
              {days} · {c.start}–{c.end}
            </span>
          );
        }
        if (row.rule_type === "keyword") {
          const c = row.condition as { keywords?: string[] };
          const kws = c.keywords ?? [];
          return (
            <span className="text-text-muted text-xs">
              {kws.slice(0, 3).join(", ")}
              {kws.length > 3 && ` +${kws.length - 3}`}
            </span>
          );
        }
        return <span className="text-text-muted text-xs">—</span>;
      },
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (
        <button onClick={() => handleToggleActive(row)} className="cursor-pointer">
          <Badge variant={row.is_active ? "success" : "error"}>
            {row.is_active ? "Ativa" : "Inativa"}
          </Badge>
        </button>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      align: "right",
      accessor: (row) => (
        <Tooltip content="Excluir">
          <Button variant="ghost" size="sm" onClick={() => setDeletingRule(row)}>
            <Trash2 className="w-4 h-4 text-error-text" />
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-main">Regras de Roteamento</h2>
          <p className="text-sm text-text-muted mt-0.5">
            As regras são avaliadas em ordem crescente. A primeira que for satisfeita define qual
            agente atende a mensagem.
          </p>
        </div>
        <Button size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Adicionar Regra
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rules}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar regras."
        emptyMessage="Nenhuma regra configurada. Adicione uma regra para rotear mensagens para agentes."
      />

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Nova Regra">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-5">
          {/* Agent */}
          <Select
            id="agent_id"
            label="Agente"
            options={(agents ?? []).map((a) => ({ value: String(a.id), label: a.name }))}
            value={watch("agent_id") ? String(watch("agent_id")) : ""}
            onChange={(v) => setValue("agent_id", Number(v), { shouldValidate: true })}
            placeholder="Selecione um agente"
            error={errors.agent_id?.message}
          />

          {/* Rule type */}
          <div className="w-full">
            <label className="block text-sm font-medium text-text-main mb-2">Tipo de Regra</label>
            <div className="flex flex-col gap-2">
              {RULE_TYPES.map((rt) => {
                const Icon = rt.icon;
                const selected = ruleType === rt.value;
                return (
                  <label
                    key={rt.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected
                        ? "border-brand-500 bg-brand-500/5"
                        : "border-border-strong hover:border-border-subtle"
                    }`}
                  >
                    <input
                      type="radio"
                      value={rt.value}
                      {...register("rule_type")}
                      className="mt-0.5 accent-brand-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-text-muted" />
                        <span className="text-sm font-medium text-text-main">{rt.label}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{rt.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Priority — hidden for default rules (always last) */}
          {ruleType !== "default" && (
            <Input
              {...register("order_index", { valueAsNumber: true })}
              id="order_index"
              label="Prioridade"
              type="number"
              min={0}
              error={errors.order_index?.message}
              placeholder={String(rules?.filter((r) => r.rule_type !== "default").length ?? 0)}
            />
          )}
          {ruleType !== "default" && (
            <p className="text-xs text-text-muted -mt-3">
              Menor número = maior prioridade. Regras com o mesmo número são avaliadas pela ordem de
              criação.
            </p>
          )}

          {/* Condition: schedule */}
          {ruleType === "schedule" && (
            <div className="flex flex-col gap-3 p-3 rounded-lg border border-border-subtle bg-bg-card">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...register("condition.start" as never)}
                  id="schedule_start"
                  label="Horário início"
                  type="time"
                />
                <Input
                  {...register("condition.end" as never)}
                  id="schedule_end"
                  label="Horário fim"
                  type="time"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-text-main mb-2">Dias da Semana</p>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: "Dom", value: 0 },
                    { label: "Seg", value: 1 },
                    { label: "Ter", value: 2 },
                    { label: "Qua", value: 3 },
                    { label: "Qui", value: 4 },
                    { label: "Sex", value: 5 },
                    { label: "Sáb", value: 6 },
                  ].map((day) => (
                    <label key={day.value} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        value={day.value}
                        {...register("condition.days" as never)}
                        className="accent-brand-500"
                      />
                      <span className="text-sm text-text-main">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Condition: keyword */}
          {ruleType === "keyword" && (
            <TagInput
              label="Palavras-chave"
              description="A regra é ativada se a mensagem contiver qualquer uma das palavras (ignora maiúsculas/minúsculas). Pressione Enter para adicionar."
              placeholder="ex: urgente"
              value={keywords}
              onChange={setKeywords}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseCreate}>
              Cancelar
            </Button>
            <Button type="submit" loading={createRule.isPending}>
              Criar
            </Button>
          </div>
        </form>
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deletingRule} onClose={() => setDeletingRule(null)} title="Confirmar Exclusão">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir esta regra? Essa ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingRule(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteRule.isPending}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
