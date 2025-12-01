'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { QrCode, Copy, Check, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';

export default function PixPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [pixData, setPixData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPixData = async () => {
      try {
        const response = await apiRequest.get(`/api/payments/order-by-code/${orderId}`);
        
        if (response.data.status === 'paid') {
          //console.log('Pedido pago...');
          toast.success('Pagamento já confirmado!');
          router.push(`/carrinho/checkout/sucesso/${orderId}`);
          return;
        }
        
        // Extrair dados do PIX da resposta
        if (response.data.charges && response.data.charges.length > 0) {
          const charge = response.data.charges[0];
          const transaction = charge.last_transaction;
          
          // Dados do PIX vêm diretamente na transaction
          if (transaction && (transaction.qr_code || transaction.qr_code_url)) {
            console.log('[PIX] QR Code found:', {
              qr_code: transaction.qr_code?.substring(0, 50) + '...',
              qr_code_url: transaction.qr_code_url,
              expires_at: transaction.expires_at
            });
            
            setPixData({
              qr_code: transaction.qr_code,
              qr_code_url: transaction.qr_code_url,
              expires_at: transaction.expires_at
            });
          } else {
            console.error('[PIX] Transaction data:', transaction);
            toast.error('Dados do PIX não encontrados para este pedido.');
            router.push(`/carrinho/checkout/falha/${orderId}`);
          }
        }
      } catch (error: any) {
        console.error('Erro ao buscar dados do PIX:', error);
        toast.error('Erro ao carregar QR Code do PIX');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchPixData();
    }
  }, [orderId, router]);

  const handleCopyCode = async () => {
    if (!pixData?.qr_code) return;
    
    try {
      await navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      toast.success('Código copiado!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error('Erro ao copiar código');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
          <p className="text-primary/70">Carregando QR Code...</p>
        </div>
      </div>
    );
  }

  if (!pixData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6 border border-primary/20">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              QR Code não encontrado
            </h1>
            <p className="text-primary/70">
              Não foi possível carregar os dados do pagamento PIX
            </p>
          </div>

          <button
            onClick={() => router.push('/carrinho')}
            className="w-full bg-accent text-primary py-3 px-6 rounded-lg font-semibold hover:bg-accent/90 transition-all shadow-md hover:shadow-lg"
          >
            Voltar ao Carrinho
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-32 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/carrinho')}
            className="flex items-center text-primary/70 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao carrinho
          </button>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Pagamento via PIX
          </h1>
          <p className="text-primary/70">
            Escaneie o QR Code ou copie o código para realizar o pagamento
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-primary/20 overflow-hidden">
          {/* QR Code Section */}
          <div className="p-8 space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-xl border-4 border-primary/10 shadow-lg">
                {pixData.qr_code_url ? (
                  <img 
                    src={pixData.qr_code_url} 
                    alt="QR Code PIX" 
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
              <p className="text-sm text-primary/70 mb-1 text-center">Número do Pedido</p>
              <p className="text-xl font-mono font-bold text-accent text-center">
                #{orderId}
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary text-lg">
                Como pagar:
              </h3>
              
              <ol className="space-y-3 text-sm text-primary/80">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Abra o aplicativo do seu banco</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>Escolha pagar via PIX</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Escaneie o QR Code acima ou copie o código abaixo</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span>Confirme o pagamento</span>
                </li>
              </ol>
            </div>

            {/* PIX Code */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">
                Ou copie o código PIX:
              </h3>
              
              <div className="relative">
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 pr-12 break-all font-mono text-xs text-primary">
                  {pixData.qr_code}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white p-2 rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-lg"
                  title="Copiar código"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              {copied && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Código copiado! Cole no seu aplicativo de pagamento.
                </p>
              )}
            </div>

            {/* Email Notice */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">
                    Informações enviadas por email
                  </h3>
                  <p className="text-sm text-primary/70 leading-relaxed">
                    Enviamos um email com o QR Code e todas as informações do seu pedido. 
                    Verifique sua caixa de entrada e spam.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>⏰ Atenção:</strong> Você tem 30 minutos para realizar o pagamento. 
                Após esse período, o QR Code expira e será necessário gerar um novo pedido.
              </p>
            </div>

            {/* Info sobre confirmação automática */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-green-800 text-center">
                ✅ Após realizar o pagamento, você será redirecionado automaticamente para a página de confirmação.
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg p-6 border border-primary/10 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-primary">Pagamento Instantâneo</h4>
            </div>
            <p className="text-sm text-primary/70">
              O pagamento é confirmado em segundos após a aprovação
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-primary/10 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary">100% Seguro</h4>
            </div>
            <p className="text-sm text-primary/70">
              Transação protegida pelo Pagar.me e seu banco
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
