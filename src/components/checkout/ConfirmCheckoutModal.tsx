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
import { Loader2, ShieldCheck } from "lucide-react";

interface CheckoutData {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  metodoPagamento: string;
}

interface ConfirmCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  checkoutData: CheckoutData;
}

export default function ConfirmCheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  checkoutData,
}: ConfirmCheckoutModalProps) {
  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      pix: "PIX",
      boleto: "Boleto Bancário",
      cartao_credito: "Cartão de Crédito",
      cartao_debito: "Cartão de Débito",
    };
    return methods[method] || method;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white border-accent">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold flex gap-2 items-center">
            Confirmar pedido
            <ShieldCheck />
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            Revise os dados do seu pedido antes de finalizar:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Dados pessoais */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm border-b border-accent pb-1 text-primary">
              Dados pessoais
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">Nome:</span>
                <span className="font-medium text-primary">
                  {checkoutData.nome}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">Email:</span>
                <span className="text-primary">{checkoutData.email}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">CPF:</span>
                <span className="text-primary">{checkoutData.cpf}</span>
              </div>
              {checkoutData.telefone && (
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="text-primary/60">Telefone:</span>
                  <span className="text-primary">{checkoutData.telefone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm border-b border-accent pb-1 text-primary">
              Endereço de entrega
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">CEP:</span>
                <span className="text-primary">{checkoutData.cep}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">Logradouro:</span>
                <span className="text-primary">{checkoutData.logradouro}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">Número:</span>
                <span className="text-primary">{checkoutData.numero}</span>
              </div>
              {checkoutData.complemento && (
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="text-primary/60">Complemento:</span>
                  <span className="text-primary">
                    {checkoutData.complemento}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">Bairro:</span>
                <span className="text-primary">{checkoutData.bairro}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">Cidade:</span>
                <span className="text-primary">
                  {checkoutData.cidade} - {checkoutData.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm border-b border-accent pb-1 text-primary">
              Pagamento
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-primary/60">Método:</span>
                <span className="font-medium text-primary">
                  {formatPaymentMethod(checkoutData.metodoPagamento)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="bg-primary cursor-pointer text-white"
          >
            Voltar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-accent cursor-pointer hover:bg-accent/30 border border-accent text-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finalizando...
              </>
            ) : (
              "Confirmar pedido"
            )}
            <ShieldCheck />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
