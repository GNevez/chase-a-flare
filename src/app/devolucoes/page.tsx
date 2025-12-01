"use client";
import { useEffect, useMemo, useState } from "react";
import { apiRequest, getBaseURL } from "@/lib/api";

type ItemPedidoDto = {
  id: number;
  produtoId: number;
  produtoNome: string;
  corId: number;
  corNome: string;
  quantidade: number;
  produtoSlug?: string;
  produtoPreco?: number;
  produtoImagem?: string;
  corHex1?: string;
  corHex2?: string;
  precoTotalItem?: number;
};

type PedidoDto = {
  id: number;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string | null;
  status: number | string;
  totalPedido: number;
  dataPedido: string;
  itens: ItemPedidoDto[];
};

function sanitizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function formatCpfMask(v: string) {
  const digits = sanitizeCpf(v);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function DevolucoesPage() {
  // monta URL absoluta para imagens vindas da API
  const toImageUrl = (path?: string): string => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = getBaseURL();
    if (path.startsWith("/")) return `${base}${path}`;
    return `${base}/${path}`;
  };
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<PedidoDto[]>([]);

  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const selectedPedido = useMemo(
    () => pedidos.find((p) => p.id === selectedPedidoId) || null,
    [pedidos, selectedPedidoId]
  );

  // Map<ItemCarrinhoId, quantidade>
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [emailChoice, setEmailChoice] = useState<"pedido" | "custom">("pedido");
  const [customEmail, setCustomEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (!selectedPedido) return false;
    const items = Object.entries(selectedItems).filter(([_, q]) => q && Number(q) > 0);
    if (items.length === 0) return false;
    if (emailChoice === "custom" && !customEmail) return false;
    return true;
  }, [selectedPedido, selectedItems, emailChoice, customEmail]);

  const handleBuscar = async () => {
    try {
      setLoading(true);
      setError(null);
      setPedidos([]);
      setSelectedPedidoId(null);
      setSelectedItems({});
      const cpfLimpo = sanitizeCpf(cpf);
      if (cpfLimpo.length !== 11) {
        setError("CPF inválido");
        return;
      }
      const res = await apiRequest.get<PedidoDto[]>(`/api/Pedido/by-cpf?cpf=${cpfLimpo}`);
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setError(e?.response?.data || e?.message || "Erro ao buscar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (item: ItemPedidoDto, checked: boolean) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (checked) {
        // default 1
        copy[item.id] = Math.min(1, item.quantidade) || 1;
      } else {
        delete copy[item.id];
      }
      return copy;
    });
  };

  const setItemQuantity = (item: ItemPedidoDto, value: number) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (value <= 0) {
        delete copy[item.id];
      } else {
        copy[item.id] = Math.min(value, item.quantidade);
      }
      return copy;
    });
  };

  const openModal = (pedidoId: number) => {
    setSelectedPedidoId(pedidoId);
    setSelectedItems({});
    setEmailChoice("pedido");
    setCustomEmail("");
    setShowModal(true);
  };

  const submitDevolucao = async () => {
    if (!selectedPedido) return;
    try {
      setSubmitting(true);
      setError(null);
      const cpfLimpo = sanitizeCpf(cpf);
      const itensPayload = Object.entries(selectedItems).map(([itemId, qtd]) => ({
        ItemCarrinhoId: Number(itemId),
        Quantidade: Number(qtd),
      }));

  const email = emailChoice === "pedido" ? selectedPedido.clienteEmail : customEmail;

      const payload = {
        PedidoId: selectedPedido.id,
        Cpf: cpfLimpo,
        NomeCliente: selectedPedido.clienteNome,
        Email: email,
        Itens: itensPayload,
      };

      const res = await apiRequest.post(`/api/Devolucao`, payload);
      setShowSuccessModal(true);
      setShowModal(false);
      // opcional: reset seleção
      setSelectedItems({});
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Erro ao solicitar devolução");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-24 py-36 bg-white">
      <h1 className="text-2xl font-bold mb-2 text-accent">
        Solicitar Devolução
      </h1>
      <p className="text-sm text-gray-700 mb-6">
        Informe seu CPF para localizar seus pedidos e selecione os itens que
        deseja devolver.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CPF
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={formatCpfMask(cpf)}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            className="flex-1 rounded border px-3 py-2 text-primary"
            maxLength={14}
          />
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{String(error)}</p>}
      </div>

      {/* Lista de pedidos */}
      {pedidos.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">
            Pedidos encontrados
          </h2>
          {pedidos.map((p) => (
            <div
              key={`pedido-${p.id}`}
              className={`rounded border p-4 ${
                selectedPedidoId === p.id ? "border-black" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">Pedido #{p.id}</p>
                  <p className="text-sm text-gray-700">
                    {new Date(p.dataPedido).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm text-gray-700">
                    {p.clienteNome} • {p.clienteEmail || "(sem e-mail)"}
                  </p>
                </div>
                <button
                  className="px-3 py-1 rounded bg-primary text-white"
                  onClick={() => openModal(p.id)}
                >
                  Selecionar devolução
                </button>
              </div>

              {/* Thumbnails das cores dos itens (primeira imagem de cada cor) */}
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {p.itens.map((it) => (
                  <div
                    key={`thumb-${p.id}-${it.id}`}
                    className="flex flex-col items-center"
                  >
                    <img
                      src={toImageUrl(it.produtoImagem)}
                      alt={`${it.produtoNome} - ${it.corNome}`}
                      className="h-20 w-20 object-cover rounded border"
                      loading="lazy"
                    />
                    <p className="mt-1 text-xs text-gray-700 text-center line-clamp-2">
                      {it.produtoNome}
                    </p>
                    <p className="text-[10px] text-gray-500">{it.corNome}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Nenhum pedido listado. Busque pelo seu CPF para começar.
        </p>
      )}

      {/* Modal */}
      {showModal && selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            {/* Botão X para fechar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold mb-2 text-accent">
              Confirmar solicitação
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enviaremos as instruções de devolução para o e-mail informado.
              Você prefere usar o e-mail do pedido ou outro?
            </p>

            {/* Seleção de itens e quantidades dentro do modal */}
            <div className="max-h-64 overflow-auto mb-4 space-y-2">
              {selectedPedido.itens.map((it) => {
                const checked = selectedItems[it.id] != null;
                const qty = selectedItems[it.id] || 0;
                return (
                  <div
                    key={`modal-item-${selectedPedido.id}-${it.id}`}
                    className="flex items-center gap-3 border rounded p-2"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleItem(it, e.target.checked)}
                    />
                    <img
                      src={toImageUrl(it.produtoImagem)}
                      alt={`${it.produtoNome} - ${it.corNome}`}
                      className="h-12 w-12 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">
                        {it.produtoNome}{" "}
                        <span className="text-gray-500">• {it.corNome}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Qtd comprada: {it.quantidade}
                      </p>
                    </div>
                    {checked && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">
                          Qtd retornar
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={it.quantidade}
                          value={qty}
                          onChange={(e) =>
                            setItemQuantity(it, Number(e.target.value))
                          }
                          className="w-20 rounded border px-2 py-1 border-primary/50 text-primary"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="emailChoice"
                  checked={emailChoice === "pedido"}
                  onChange={() => setEmailChoice("pedido")}
                />
                <span className="text-sm text-primary">
                  Usar e-mail do pedido{" "}
                  <strong> ({selectedPedido.clienteEmail})</strong>
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="emailChoice"
                  checked={emailChoice === "custom"}
                  onChange={() => setEmailChoice("custom")}
                />
                <span className="text-sm text-primary">Usar outro e-mail</span>
              </label>

              {emailChoice === "custom" && (
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full rounded border px-3 py-2 border-primary/50 text-primary"
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                onClick={submitDevolucao}
                disabled={!canSubmit || submitting}
                className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md text-center relative">
            {/* Botão X para fechar */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setPedidos([]);
                setCpf("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-primary">Tudo Certo!</h3>
            <p className="text-gray-700 mb-6">
              Sua solicitação foi enviada! Em algumas horas enviaremos no seu e-mail instruções para realização da devolução. Fique atento!
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setPedidos([]);
                setCpf("");
              }}
              className="px-6 py-2 rounded bg-primary text-white font-medium"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
