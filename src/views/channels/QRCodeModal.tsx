import { useEffect } from "react";

import { Modal, Button } from "@/components";

import { useChannelQR } from "./hooks";

interface QRCodeModalProps {
  channelId: number;
  onClose: () => void;
}

export function QRCodeModal({ channelId, onClose }: QRCodeModalProps) {
  const { data, isLoading, isError } = useChannelQR(channelId, true);

  useEffect(() => {
    if (data?.status === "active") {
      onClose();
    }
  }, [data?.status, onClose]);

  return (
    <Modal open onClose={onClose} title="QR Code — Conectar WhatsApp">
      <div className="flex flex-col items-center gap-4 py-2">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-text-muted">Gerando QR Code...</p>
          </div>
        )}

        {isError && (
          <p className="text-sm text-error-text py-4">
            Erro ao obter QR Code. Verifique se o canal está configurado corretamente.
          </p>
        )}

        {data?.qr && data.status !== "active" && (
          <>
            <img
              src={`data:image/png;base64,${data.qr}`}
              alt="QR Code WhatsApp"
              className="w-64 h-64 rounded-lg border border-border-subtle"
            />
            <p className="text-sm text-text-muted text-center">
              Escaneie o QR Code com o WhatsApp para conectar. A janela fechará automaticamente após
              a conexão.
            </p>
          </>
        )}

        {!data?.qr && !isLoading && !isError && data?.status === "pending_qr" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-text-muted">Preparando sessão, aguarde...</p>
          </div>
        )}

        {!data?.qr && !isLoading && !isError && data?.status !== "pending_qr" && (
          <p className="text-sm text-text-muted py-4">QR Code não disponível no momento.</p>
        )}

        <div className="flex justify-end w-full pt-2">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
