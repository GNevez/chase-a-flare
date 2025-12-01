"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clipboard, QrCode } from "lucide-react";
import { useState } from "react";

interface PixQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: any;
  paymentIntentId?: string;
}

export default function PixQRCodeModal({
  isOpen,
  onClose,
  pixData,
  paymentIntentId,
}: PixQRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!pixData) {
    return null;
  }

  // Try common fields: qr_code (url), qr_code_base64, payload, hosted_voucher_url
  const qrUrl = pixData.qr_code || pixData.qr_code_url || pixData.hosted_voucher_url || null;
  const qrBase64 = pixData.qr_code_base64 || pixData.image_base64 || null;
  const payload = pixData.payload || pixData.emv || pixData.txid || null;

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white border-accent">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold flex gap-2 items-center">
            Pagamento via PIX
            <QrCode />
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            Escaneie o QR code abaixo com o app do seu banco para concluir o pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {qrBase64 ? (
            <div className="flex justify-center">
              <img src={`data:image/png;base64,${qrBase64}`} alt="PIX QR" className="max-h-64" />
            </div>
          ) : qrUrl ? (
            <div className="flex justify-center">
              <img src={qrUrl} alt="PIX QR" className="max-h-64" />
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 rounded border">QR code não disponível como imagem</div>
          )}

          {payload && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-primary/70">Payload (código PIX)</div>
                <Button size="sm" onClick={() => onCopy(payload)}>
                  <Clipboard className="mr-2 h-4 w-4" /> {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
              <div className="p-3 border rounded bg-neutral-50 text-sm break-words">{payload}</div>
            </div>
          )}

          {pixData.expires_at && (
            <div className="text-sm text-primary/60">Expira em: {new Date(pixData.expires_at * 1000).toLocaleString()}</div>
          )}

          {paymentIntentId && (
            <div className="text-xs text-primary/60">Pagamento: {paymentIntentId}</div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-primary text-white">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
