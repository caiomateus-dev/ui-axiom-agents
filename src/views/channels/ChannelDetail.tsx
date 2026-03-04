import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Link2, Link2Off, QrCode } from "lucide-react";

import { useToast } from "@/contexts/ToastContext";

import { Badge, Button, Input, Select, Spinner, TagInput } from "@/components";

import { formatDate } from "@/utils";

import { ChannelRules } from "./ChannelRules";
import { ConversationList } from "./ConversationList";
import type { ChannelFormData } from "./dtos/request/channel.schema";
import { channelSchema } from "./dtos/request/channel.schema";
import { useChannels, useConnectChannel, useDisconnectChannel, useUpdateChannel } from "./hooks";
import { QRCodeModal } from "./QRCodeModal";

const STATUS_LABELS = {
  active: "Ativo",
  inactive: "Inativo",
  pending_qr: "Aguardando QR",
  error: "Erro",
} as const;

const STATUS_VARIANTS = {
  active: "success",
  inactive: "error",
  pending_qr: "warning",
  error: "error",
} as const;

const TABS = ["config", "regras", "conversas"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  config: "Configuração",
  regras: "Regras",
  conversas: "Conversas",
};

// Validates a WhatsApp number format: digits only, 10–15 chars (e.g. 5511999990000)
function validateWhatsAppNumber(tag: string): string | null {
  if (!/^\d{10,15}$/.test(tag)) {
    return "Use apenas dígitos com DDD e código do país (ex: 5511999990000)";
  }
  return null;
}

export function ChannelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const channelId = Number(id);
  const [activeTab, setActiveTab] = useState<Tab>("config");
  const [showQR, setShowQR] = useState(false);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [whitelistReady, setWhitelistReady] = useState(false);
  const [allowGroups, setAllowGroups] = useState<string>("none");

  const { data: channels, isLoading } = useChannels();
  const channel = channels?.find((c) => c.id === channelId);

  const updateChannel = useUpdateChannel();
  const connectChannel = useConnectChannel();
  const disconnectChannel = useDisconnectChannel();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<Pick<ChannelFormData, "name">>({
    values: channel ? { name: channel.name } : undefined,
    resolver: zodResolver(channelSchema.pick({ name: true })),
  });

  // Sync whitelist and allow_groups from channel data once
  if (channel && !whitelistReady) {
    setWhitelist(channel.whitelist ?? []);
    setAllowGroups((channel.config?.allow_groups as string) ?? "none");
    setWhitelistReady(true);
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateChannel.mutateAsync({
        id: channelId,
        data: { ...data, whitelist, config: { ...channel?.config, allow_groups: allowGroups } },
      });
      toast.success("Canal atualizado com sucesso");
      reset({ name: data.name });
    } catch {
      toast.error("Erro ao atualizar canal");
    }
  });

  async function handleConnect() {
    try {
      await connectChannel.mutateAsync(channelId);
      toast.success("Conectando canal...");
      if (channel?.provider === "whatsapp_waha") {
        setShowQR(true);
      }
    } catch {
      toast.error("Erro ao conectar canal");
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectChannel.mutateAsync(channelId);
      toast.success("Canal desconectado");
    } catch {
      toast.error("Erro ao desconectar canal");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="p-6">
        <p className="text-sm text-text-muted">Canal não encontrado.</p>
      </div>
    );
  }

  const formDirty =
    isDirty ||
    JSON.stringify(whitelist) !== JSON.stringify(channel.whitelist ?? []) ||
    allowGroups !== ((channel.config?.allow_groups as string) ?? "none");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/channels")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-main">{channel.name}</h1>
            <Badge variant={STATUS_VARIANTS[channel.status]}>{STATUS_LABELS[channel.status]}</Badge>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            {channel.phone_number ? `+${channel.phone_number}` : "Sem número"} •{" "}
            {formatDate(channel.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {channel.status === "pending_qr" && channel.provider === "whatsapp_waha" && (
            <Button variant="secondary" size="sm" onClick={() => setShowQR(true)}>
              <QrCode className="w-4 h-4" />
              Ver QR
            </Button>
          )}
          {channel.status === "active" ? (
            <Button variant="secondary" size="sm" onClick={handleDisconnect}>
              <Link2Off className="w-4 h-4" />
              Desconectar
            </Button>
          ) : (
            <Button size="sm" onClick={handleConnect}>
              <Link2 className="w-4 h-4" />
              Conectar
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-subtle mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-text-muted hover:text-text-main"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "config" && (
        <form onSubmit={onSubmit} className="max-w-lg flex flex-col gap-4">
          <Input {...register("name")} id="name" label="Nome" error={errors.name?.message} />

          <TagInput
            label="Whitelist de números"
            description="Deixe vazio para aceitar mensagens de qualquer número. Adicione números com DDD e código do país (ex: 5511999990000)."
            placeholder="5511999990000 e pressione Enter"
            value={whitelist}
            onChange={setWhitelist}
            validate={validateWhatsAppNumber}
          />

          <Select
            id="allow_groups"
            label="Mensagens de Grupo"
            options={[
              { value: "none", label: "Ignorar grupos" },
              { value: "all", label: "Individuais e grupos" },
              { value: "only", label: "Apenas grupos" },
            ]}
            value={allowGroups}
            onChange={setAllowGroups}
            description="Define quais tipos de conversa este canal deve processar."
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={!formDirty} loading={updateChannel.isPending}>
              Salvar
            </Button>
          </div>
        </form>
      )}

      {activeTab === "regras" && <ChannelRules channelId={channelId} />}

      {activeTab === "conversas" && <ConversationList channelId={channelId} />}

      {/* QR Code Modal */}
      {showQR && <QRCodeModal channelId={channelId} onClose={() => setShowQR(false)} />}
    </div>
  );
}
