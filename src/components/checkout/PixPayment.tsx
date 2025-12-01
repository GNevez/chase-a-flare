"use client";

import { useState } from "react";
import { QrCode, Copy, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface PixPaymentProps {
  pixData: {
    qr_code?: string;
    qr_code_url?: string;
  } | null;
  orderId?: string;
  onClose?: () => void;
}

export function PixPayment({ pixData, orderId, onClose }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPixCode = async () => {
    if (pixData?.qr_code) {
      try {
        await navigator.clipboard.writeText(pixData.qr_code);
        setCopied(true);
        toast.success("Código PIX copiado!");
        setTimeout(() => setCopied(false), 3000);
      } catch (error) {
        toast.error("Erro ao copiar código");
      }
    }
  };

  if (!pixData) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Gerando código PIX...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Pagamento via PIX
        </h2>
        <p className="text-gray-600">
          Escaneie o QR Code ou copie o código para pagar
        </p>
      </div>

      {/* Order Info */}
      {orderId && (
        <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
          <p className="text-sm text-gray-600 mb-1 text-center">
            Número do Pedido
          </p>
          <p className="text-lg font-mono font-bold text-accent text-center">
            #{orderId}
          </p>
        </div>
      )}

      {/* QR Code */}
      {pixData.qr_code_url && (
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-lg">
            <Image
              src={pixData.qr_code_url}
              alt="QR Code PIX"
              width={250}
              height={250}
              className="w-64 h-64"
            />
          </div>
        </div>
      )}

      {/* PIX Code */}
      {pixData.qr_code && (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Código PIX Copia e Cola
            </p>
            <p className="text-sm font-mono text-gray-800 break-all leading-relaxed">
              {pixData.qr_code}
            </p>
          </div>

          <button
            onClick={handleCopyPixCode}
            className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Código Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copiar Código PIX</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Como pagar:</h3>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Abra o app do seu banco</li>
          <li>Escolha pagar via PIX</li>
          <li>Escaneie o QR Code ou cole o código</li>
          <li>Confirme o pagamento</li>
        </ol>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <p className="text-sm text-amber-800">
          ⚠️ O pagamento via PIX expira em <strong>1 hora</strong>. Após a
          confirmação, seu pedido será processado automaticamente.
        </p>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all"
        >
          Fechar
        </button>
      )}
    </div>
  );
}
