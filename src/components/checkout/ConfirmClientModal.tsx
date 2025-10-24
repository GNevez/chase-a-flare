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

interface ClienteExistente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
}

interface ConfirmClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteExistente: ClienteExistente;
  onUseExisting: () => void;
  onUseNew: () => void;
}

export default function ConfirmClientModal({
  isOpen,
  onClose,
  clienteExistente,
  onUseExisting,
  onUseNew,
}: ConfirmClientModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-accent">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold">
            CPF já cadastrado
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            Encontramos um cadastro com este CPF. Verifique se os dados estão
            corretos:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="font-medium text-primary/60">Nome:</span>
            <span className="font-medium text-primary">
              {clienteExistente.nome}
            </span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="font-medium text-primary/60">Email:</span>
            <span className="text-primary">{clienteExistente.email}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="font-medium text-primary/60">CPF:</span>
            <span className="text-primary">{clienteExistente.cpf}</span>
          </div>
          {clienteExistente.telefone && (
            <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
              <span className="font-medium text-primary/60">Telefone:</span>
              <span className="text-primary">{clienteExistente.telefone}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            onClick={onUseNew}
            className="bg-primary cursor-pointer text-white"
          >
            Usar dados novos
          </Button>
          <Button
            onClick={onUseExisting}
            className="bg-accent cursor-pointer hover:bg-accent/30 border border-accent text-primary"
          >
            Usar dados existentes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
