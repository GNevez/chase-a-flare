"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getBaseURL } from "@/lib/utils";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  ChevronRight,
  PackageCheck,
  PackageX,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventoRastreamento {
  dataHora: string;
  descricao: string;
  tipo?: string;
  unidade?: string;
  cidade?: string;
  uf?: string;
}

interface RastreamentoResponse {
  codigoObjeto: string;
  tipoPostal?: string;
  eventos: EventoRastreamento[];
  mensagem?: string;
}

const getIconForEvento = (descricao: string, tipo?: string) => {
  const desc = descricao.toLowerCase();

  if (desc.includes("entregue") || desc.includes("entrega efetuada")) {
    return <CheckCircle2 className="w-5 h-5" />;
  }
  if (desc.includes("saiu para entrega") || desc.includes("a caminho")) {
    return <Truck className="w-5 h-5" />;
  }
  if (desc.includes("postado") || desc.includes("postagem")) {
    return <Package className="w-5 h-5" />;
  }
  if (desc.includes("trânsito") || desc.includes("encaminhado")) {
    return <MapPin className="w-5 h-5" />;
  }
  if (desc.includes("etiqueta") || desc.includes("emitida")) {
    return <Clock className="w-5 h-5" />;
  }
  if (
    desc.includes("ausente") ||
    desc.includes("tentativa") ||
    desc.includes("não entregue")
  ) {
    return <AlertCircle className="w-5 h-5" />;
  }
  if (desc.includes("devolvido") || desc.includes("devolução")) {
    return <PackageX className="w-5 h-5" />;
  }
  if (desc.includes("unidade") || desc.includes("distribuição")) {
    return <Building2 className="w-5 h-5" />;
  }
  if (desc.includes("pedido")) {
    return <PackageCheck className="w-5 h-5" />;
  }

  return <Package className="w-5 h-5" />;
};

const getColorForEvento = (descricao: string) => {
  const desc = descricao.toLowerCase();

  if (desc.includes("entregue") || desc.includes("entrega efetuada")) {
    return "bg-green-500";
  }
  if (desc.includes("saiu para entrega") || desc.includes("a caminho")) {
    return "bg-accent";
  }
  if (
    desc.includes("ausente") ||
    desc.includes("tentativa") ||
    desc.includes("não entregue")
  ) {
    return "bg-orange-500";
  }
  if (desc.includes("devolvido") || desc.includes("devolução")) {
    return "bg-red-500";
  }

  return "bg-gray-300";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export default function RastreioPage() {
  const [codigo, setCodigo] = useState("");
  const [rastreamento, setRastreamento] = useState<RastreamentoResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo.trim()) {
      setError("Digite um código de rastreamento ou código do pedido");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(
        `${getBaseURL()}/api/correios/rastreamento/publico/${codigo.trim()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar rastreamento");
      }

      const data = await response.json();
      setRastreamento(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar rastreamento"
      );
      setRastreamento(null);
    } finally {
      setLoading(false);
    }
  };

  const isDelivered =
    rastreamento?.eventos?.[0]?.descricao
      ?.toLowerCase()
      .includes("entregue") ||
    rastreamento?.eventos?.[0]?.descricao
      ?.toLowerCase()
      .includes("entrega efetuada");

  return (
    <div className="min-h-screen bg-white pt-8 md:pt-12">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100/80 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 border border-accent/30">
              <Truck className="w-4 h-4" />
              <span className="text-sm font-medium">Rastreamento</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Rastreie seu{" "}
              <span className="text-accent">Pedido</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Digite o código do seu pedido (CAF-XXXXXXXX) ou o código de
              rastreamento dos Correios
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ex: CAF-12345678 ou AB123456789BR"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    className="pl-12 h-14 text-base bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-xl text-gray-900 placeholder:text-gray-400 shadow-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Rastrear
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Quick tips */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1.5 rounded-full">
                💡 Código do pedido: CAF-XXXXXXXX
              </span>
              <span className="bg-gray-100 px-3 py-1.5 rounded-full">
                📦 Rastreio Correios: XX123456789BR
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 pb-16"
          >
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                      <Truck className="w-8 h-8 text-accent animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
                  </div>
                  <p className="text-gray-500">
                    Buscando informações do seu pedido...
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {error && searched && !loading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 pb-16"
          >
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ops! Algo deu errado
                </h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </motion.section>
        )}

        {rastreamento && !loading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 pb-16"
          >
            <div className="max-w-3xl mx-auto">
              {/* Status Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl p-6 md:p-8 mb-6 border shadow-sm ${
                  isDelivered
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDelivered ? "bg-green-100" : "bg-accent/20"
                    }`}
                  >
                    {isDelivered ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <Truck className="w-8 h-8 text-accent" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">
                        Código:
                      </span>
                      <span className="font-mono font-semibold text-accent bg-accent/10 px-3 py-1 rounded-lg border border-accent/30">
                        {rastreamento.codigoObjeto}
                      </span>
                      {rastreamento.tipoPostal && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 border border-gray-200">
                          {rastreamento.tipoPostal}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {rastreamento.eventos?.[0]?.descricao ||
                        rastreamento.mensagem ||
                        "Aguardando atualização"}
                    </h2>
                    {rastreamento.eventos?.[0] && (
                      <p className="text-gray-500 mt-1">
                        {formatDate(rastreamento.eventos[0].dataHora).date} às{" "}
                        {formatDate(rastreamento.eventos[0].dataHora).time}
                        {rastreamento.eventos[0].cidade &&
                          ` • ${rastreamento.eventos[0].cidade}`}
                        {rastreamento.eventos[0].uf &&
                          `/${rastreamento.eventos[0].uf}`}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Timeline */}
              {rastreamento.eventos && rastreamento.eventos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      Histórico de Movimentação
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="relative">
                      {rastreamento.eventos.map((evento, index) => {
                        const { date, time } = formatDate(evento.dataHora);
                        const isFirst = index === 0;
                        const isLast =
                          index === rastreamento.eventos.length - 1;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="relative pl-10 pb-8 last:pb-0"
                          >
                            {/* Timeline line */}
                            {!isLast && (
                              <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gray-200" />
                            )}

                            {/* Timeline dot */}
                            <div
                              className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${
                                isFirst
                                  ? getColorForEvento(evento.descricao || "")
                                  : "bg-gray-200"
                              } ${isFirst ? "ring-4 ring-opacity-20" : ""}`}
                              style={
                                isFirst
                                  ? {
                                      boxShadow: `0 0 0 4px ${
                                        getColorForEvento(
                                          evento.descricao || ""
                                        ) === "bg-green-500"
                                          ? "rgba(34, 197, 94, 0.2)"
                                          : getColorForEvento(
                                              evento.descricao || ""
                                            ) === "bg-accent"
                                          ? "rgba(250, 204, 21, 0.2)"
                                          : "rgba(209, 213, 219, 0.4)"
                                      }`,
                                    }
                                  : {}
                              }
                            >
                              <span
                                className={
                                  isFirst ? "text-white" : "text-gray-400"
                                }
                              >
                                {getIconForEvento(
                                  evento.descricao || "",
                                  evento.tipo
                                )}
                              </span>
                            </div>

                            {/* Content */}
                            <div
                              className={`rounded-xl p-4 border ${
                                isFirst
                                  ? "bg-accent/5 border-accent/30"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                                  {date}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {time}
                                </span>
                              </div>
                              <p
                                className={`font-medium ${
                                  isFirst
                                    ? "text-gray-900"
                                    : "text-gray-600"
                                }`}
                              >
                                {evento.descricao}
                              </p>
                              {(evento.unidade ||
                                evento.cidade ||
                                evento.uf) && (
                                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  <span>
                                    {evento.unidade}
                                    {evento.cidade && ` • ${evento.cidade}`}
                                    {evento.uf && `/${evento.uf}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message card if no events */}
              {rastreamento.mensagem &&
                (!rastreamento.eventos ||
                  rastreamento.eventos.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-accent/10 border border-accent/30 rounded-2xl p-6 text-center"
                  >
                    <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                    <p className="text-gray-700">{rastreamento.mensagem}</p>
                  </motion.div>
                )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Help Section */}
      {!searched && (
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Como funciona?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Package className="w-6 h-6" />,
                  title: "1. Encontre seu código",
                  description:
                    "Você pode usar o código do pedido (CAF-XXXXXXXX) que está no seu email de confirmação ou o código de rastreamento dos Correios.",
                },
                {
                  icon: <Search className="w-6 h-6" />,
                  title: "2. Digite e busque",
                  description:
                    "Cole ou digite o código no campo acima e clique em 'Rastrear' para ver todas as atualizações.",
                },
                {
                  icon: <Truck className="w-6 h-6" />,
                  title: "3. Acompanhe a entrega",
                  description:
                    "Veja em tempo real por onde seu pedido passou e quando chegará até você.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-accent/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "Quanto tempo demora para atualizar o rastreamento?",
                answer:
                  "O rastreamento é atualizado automaticamente pelos Correios a cada movimentação do pacote. Em média, as atualizações ocorrem a cada 12-24 horas.",
              },
              {
                question: 'Por que meu pedido está "Aguardando postagem"?',
                answer:
                  "Isso significa que seu pedido foi preparado e está pronto para ser enviado. Em breve você receberá a atualização de postagem.",
              },
              {
                question: "O que fazer se o rastreamento não atualiza há dias?",
                answer:
                  "Se não houver atualização por mais de 5 dias úteis, entre em contato conosco através do email ou WhatsApp para verificarmos junto aos Correios.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * index }}
                className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-300"
              >
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-accent" />
                  {faq.question}
                </h4>
                <p className="text-sm text-gray-500 mt-2 pl-6">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
