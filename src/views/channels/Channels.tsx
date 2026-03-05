import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Link2Off, Plus, QrCode, Trash2 } from "lucide-react";

import { useToast } from "@/contexts/ToastContext";

import { Badge, Button, Input, Modal, Select, SlidePanel, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { useApplications } from "@/views/applications/hooks/use-applications";

import { formatDate } from "@/utils";

import type { ChannelFormData } from "./dtos/request/channel.schema";
import { channelSchema } from "./dtos/request/channel.schema";
import type { ChannelResponse } from "./dtos/response/channel.response";
import {
  useChannels,
  useConnectChannel,
  useCreateChannel,
  useDeleteChannel,
  useDisconnectChannel,
} from "./hooks";
import { QRCodeModal } from "./QRCodeModal";

const STATUS_LABELS: Record<ChannelResponse["status"], string> = {
  active: "Ativo",
  inactive: "Inativo",
  pending_qr: "Aguardando QR",
  error: "Erro",
};

const STATUS_VARIANTS: Record<ChannelResponse["status"], "success" | "error" | "warning" | "info"> =
  {
    active: "success",
    inactive: "error",
    pending_qr: "warning",
    error: "error",
  };

const PROVIDER_LABELS: Record<ChannelResponse["provider"], string> = {
  whatsapp_waha: "WhatsApp (Não oficial)",
  whatsapp_cloud: "WhatsApp (API Oficial)",
};

const PROVIDER_OPTIONS = [
  { value: "whatsapp_waha", label: "WhatsApp (Não oficial)" },
  { value: "whatsapp_cloud", label: "WhatsApp (API Oficial)" },
];

const GROUP_POLICY_OPTIONS = [
  { value: "none", label: "Ignorar grupos" },
  { value: "all", label: "Individuais e grupos" },
  { value: "only", label: "Apenas grupos" },
];

export function Channels() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingChannel, setDeletingChannel] = useState<ChannelResponse | null>(null);
  const [qrChannelId, setQrChannelId] = useState<number | null>(null);
  const [allowGroups, setAllowGroups] = useState("none");

  const { data: channels, isLoading, isError } = useChannels();
  const { data: applications } = useApplications();
  const createChannel = useCreateChannel();
  const deleteChannel = useDeleteChannel();
  const connectChannel = useConnectChannel();
  const disconnectChannel = useDisconnectChannel();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChannelFormData>({
    // setValue used for provider and application_id selects
    resolver: zodResolver(channelSchema),
  });

  const selectedProvider = watch("provider") ?? "";
  const selectedAppId = watch("application_id");

  const appOptions = (applications ?? []).map((app) => ({
    value: String(app.id),
    label: app.name,
  }));

  function handleOpenCreate() {
    reset();
    setAllowGroups("none");
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    reset();
    setAllowGroups("none");
  }

  const onCreateSubmit = handleSubmit(async (data) => {
    try {
      await createChannel.mutateAsync({
        ...data,
        config: { ...data.config, allow_groups: allowGroups },
      });
      toast.success("Canal criado com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar canal");
    }
  });

  async function handleConnect(channel: ChannelResponse) {
    try {
      await connectChannel.mutateAsync(channel.id);
      toast.success("Conectando canal...");
      if (channel.provider === "whatsapp_waha") {
        setQrChannelId(channel.id);
      }
    } catch {
      toast.error("Erro ao conectar canal");
    }
  }

  async function handleDisconnect(channel: ChannelResponse) {
    try {
      await disconnectChannel.mutateAsync(channel.id);
      toast.success("Canal desconectado");
    } catch {
      toast.error("Erro ao desconectar canal");
    }
  }

  async function handleDelete() {
    if (!deletingChannel) return;
    try {
      await deleteChannel.mutateAsync(deletingChannel.id);
      toast.success("Canal removido");
      setDeletingChannel(null);
    } catch {
      toast.error("Erro ao remover canal");
    }
  }

  const columns: ColumnDef<ChannelResponse>[] = [
    {
      id: "name",
      header: "Nome",
      accessor: (row) => (
        <button
          className="font-medium text-text-main hover:text-brand-500 transition-colors text-left"
          onClick={() => navigate(`/channels/${row.id}`)}
        >
          {row.name}
        </button>
      ),
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: "provider",
      header: "Provider",
      accessor: (row) => <span className="text-text-muted">{PROVIDER_LABELS[row.provider]}</span>,
    },
    {
      id: "phone_number",
      header: "Telefone",
      accessor: (row) => <span className="text-text-muted">{row.phone_number || "-"}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (
        <Badge variant={STATUS_VARIANTS[row.status]}>{STATUS_LABELS[row.status]}</Badge>
      ),
    },
    {
      id: "created_at",
      header: "Criado em",
      accessor: (row) => <span className="text-text-muted">{formatDate(row.created_at)}</span>,
    },
    {
      id: "actions",
      header: "Ações",
      align: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          {row.status === "pending_qr" && row.provider === "whatsapp_waha" && (
            <Tooltip content="Ver QR Code">
              <Button variant="ghost" size="sm" onClick={() => setQrChannelId(row.id)}>
                <QrCode className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}
          {row.status === "active" ? (
            <Tooltip content="Desconectar">
              <Button variant="ghost" size="sm" onClick={() => handleDisconnect(row)}>
                <Link2Off className="w-4 h-4 text-error-text" />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="Conectar">
              <Button variant="ghost" size="sm" onClick={() => handleConnect(row)}>
                <Link2 className="w-4 h-4 text-brand-500" />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Excluir">
            <Button variant="ghost" size="sm" onClick={() => setDeletingChannel(row)}>
              <Trash2 className="w-4 h-4 text-error-text" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Canais</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Novo Canal
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={channels}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar canais. Tente novamente mais tarde."
        emptyMessage='Nenhum canal encontrado. Clique em "Novo Canal" para começar.'
        onRowClick={(row) => navigate(`/channels/${row.id}`)}
      />

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Novo Canal">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <Input
            {...register("name")}
            id="name"
            label="Nome"
            placeholder="Ex: Suporte WhatsApp"
            error={errors.name?.message}
          />

          <Select
            id="provider"
            label="Provider"
            options={PROVIDER_OPTIONS}
            value={selectedProvider}
            onChange={(v) =>
              setValue("provider", v as ChannelFormData["provider"], { shouldValidate: true })
            }
            placeholder="Selecione o provider"
            error={errors.provider?.message}
          />

          <Select
            id="application_id"
            label="Aplicação"
            options={appOptions}
            value={selectedAppId ? String(selectedAppId) : ""}
            onChange={(v) => setValue("application_id", Number(v), { shouldValidate: true })}
            placeholder="Selecione a aplicação"
            error={errors.application_id?.message}
          />

          {selectedProvider === "whatsapp_cloud" && (
            <>
              <Input
                {...register("config.phone_number_id" as never)}
                id="phone_number_id"
                label="Phone Number ID"
                placeholder="ID do número no Meta"
              />
              <Input
                {...register("config.access_token" as never)}
                id="access_token"
                label="Access Token"
                placeholder="Token de acesso da Meta"
                type="password"
              />
              <Input
                {...register("config.verify_token" as never)}
                id="verify_token"
                label="Verify Token"
                placeholder="Token para verificação do webhook"
              />
            </>
          )}

          <Select
            id="allow_groups"
            label="Mensagens de Grupo"
            options={GROUP_POLICY_OPTIONS}
            value={allowGroups}
            onChange={setAllowGroups}
            description="Define quais tipos de conversa este canal deve processar."
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseCreate}>
              Cancelar
            </Button>
            <Button type="submit" loading={createChannel.isPending}>
              Criar
            </Button>
          </div>
        </form>
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingChannel}
        onClose={() => setDeletingChannel(null)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir o canal{" "}
            <span className="font-medium text-text-main">{deletingChannel?.name}</span>? Essa ação
            não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingChannel(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteChannel.isPending}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Code Modal */}
      {qrChannelId !== null && (
        <QRCodeModal channelId={qrChannelId} onClose={() => setQrChannelId(null)} />
      )}
    </div>
  );
}
