"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DanfePage() {
  const params = useParams();
  const chaveAcesso = params.chaveAcesso as string;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!chaveAcesso || chaveAcesso.length !== 44 || !/^\d+$/.test(chaveAcesso)) {
        setError("Chave de acesso inválida");
        setLoading(false);
        return;
      }

      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${backendUrl}/api/nfe/danfe/${chaveAcesso}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("DANFE não encontrado");
          } else {
            setError("Erro ao carregar DANFE");
          }
          setLoading(false);
          return;
        }

        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPdfDataUrl(reader.result as string);
          setLoading(false);
        };
        reader.onerror = () => {
          setError("Erro ao processar PDF");
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch {
        setError("Erro ao conectar com o servidor");
        setLoading(false);
      }
    };

    loadPdf();
  }, [chaveAcesso]);

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = `DANFE_${chaveAcesso}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formatar chave de acesso em grupos de 4
  const formatChaveAcesso = (chave: string) => {
    return chave.replace(/(.{4})/g, "$1 ").trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Carregando DANFE...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Ops! Algo deu errado</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary font-semibold rounded-full hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-32 px-4">
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            DANFE - <span className="text-accent">Nota Fiscal</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Documento Auxiliar da Nota Fiscal Eletrônica
          </p>
        </motion.div>

        {/* Card Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Barra de ações */}
          <div className="bg-primary text-white px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400">Chave de Acesso</p>
                <p className="text-xs font-mono text-gray-300 truncate max-w-[200px] md:max-w-[300px]">
                  {formatChaveAcesso(chaveAcesso)}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-accent transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar PDF</span>
            </button>
          </div>

          {/* Visualizador do PDF */}
          <div className="p-4 md:p-6 bg-gray-50">
            <div className="bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden">
              <object
                data={pdfDataUrl || ""}
                type="application/pdf"
                className="w-full"
                style={{ height: "70vh", minHeight: "500px" }}
              >
                {/* Fallback */}
                <div className="flex flex-col items-center justify-center py-16 px-8">
                  <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 text-center font-medium">
                    Visualização não suportada
                  </p>
                  <p className="text-gray-400 text-sm mb-6 text-center">
                    Seu navegador não suporta visualização de PDF embutida.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-primary font-semibold rounded-full hover:bg-amber-500 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </button>
                </div>
              </object>
            </div>
          </div>

          {/* Chave de acesso mobile */}
          <div className="sm:hidden px-4 pb-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Chave de Acesso:</p>
              <p className="text-[10px] font-mono text-gray-700 break-all">
                {formatChaveAcesso(chaveAcesso)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rodapé informativo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-xs">
            Consulte a autenticidade em{" "}
            <a
              href="https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Portal da Nota Fiscal Eletrônica
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
