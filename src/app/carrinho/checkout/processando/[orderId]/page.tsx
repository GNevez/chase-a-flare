'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';
import { Loader2, Mail, CheckCircle2, Shield, Clock } from 'lucide-react';

export default function ProcessandoPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [pollingError, setPollingError] = useState<string | null>(null);
  const attemptsRef = useRef(0);
  const hasRedirectedRef = useRef(false);
  const maxAttempts = 60; // 5 minutos (60 * 5 segundos)

  const { order, loading, error, refetch } = useOrder({ 
    orderId,
    enabled: false,
    onSuccess: (orderData) => {
      console.log(`[Polling] Tentativa ${attemptsRef.current + 1}/${maxAttempts} - Status: ${orderData.status}`);
      
      if (!hasRedirectedRef.current) {
        if (orderData.status === 1) {
          // EmSeparacao - Pagamento aprovado
          console.log('[Polling] Pagamento confirmado! Redirecionando para página de sucesso...');
          hasRedirectedRef.current = true;
          setIsProcessing(false);
          
          setTimeout(() => {
            router.push(`/carrinho/checkout/sucesso/${orderId}`);
          }, 1000);
        } else if (orderData.status === 4) {
          console.log('[Polling] Pagamento falhou! Redirecionando para página de falha...');
          hasRedirectedRef.current = true;
          setIsProcessing(false);
          
          setTimeout(() => {
            router.push(`/carrinho/checkout/falha/${orderId}`);
          }, 1000);
        }
      }
    },
    onError: (errorMessage) => {
      console.error('Erro ao verificar status do pedido:', errorMessage);
      attemptsRef.current++;
      
      if (attemptsRef.current >= maxAttempts) {
        console.warn('[Polling] Timeout atingido - Redirecionando para página de timeout');
        setPollingError('Não foi possível confirmar o pagamento automaticamente. Por favor, verifique seu email ou acompanhe pelo painel.');
        setIsProcessing(false);
        
        // Após 3 segundos, redirecionar para home
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    }
  });

  useEffect(() => {
    if (!orderId) {
      setPollingError('ID do pedido não encontrado');
      setIsProcessing(false);
      return;
    }

    let isMounted = true;
    
    // Verifica imediatamente
    refetch();

    // Polling a cada 5 segundos
    const interval = setInterval(() => {
      if (!isMounted || !isProcessing) {
        clearInterval(interval);
        return;
      }

      if (attemptsRef.current < maxAttempts) {
        refetch();
        attemptsRef.current++;
      } else {
        clearInterval(interval);
        setPollingError('Não foi possível confirmar o pagamento. Por favor, verifique seu email ou entre em contato.');
        setIsProcessing(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (error || pollingError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-32">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6 border border-primary/20">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Ops! Algo deu errado
            </h1>
            <p className="text-primary/70">{error || pollingError}</p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-accent text-primary py-3 px-6 rounded-lg font-semibold hover:bg-accent/90 transition-all shadow-md hover:shadow-lg"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-32">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8 border border-primary/20">
        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/30">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
            <div className="absolute -inset-2 bg-accent/5 rounded-full animate-pulse" />
          </div>

              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-primary">
                  Processando seu pagamento
                </h1>
                <p className="text-lg text-primary/70">
                  Aguarde enquanto confirmamos sua compra...
                </p>
              </div>

              {/* Order Number */}
              <div className="w-full bg-accent/5 rounded-xl p-6 border-2 border-accent/30">
                <p className="text-sm text-primary/70 mb-1 text-center">Número do Pedido</p>
                <p className="text-2xl font-mono font-bold text-accent text-center">
                  #{orderId}
                </p>
              </div>
        </div>

        {/* Email Card */}
        <div className="bg-accent/5 rounded-xl p-6 border border-primary/10">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                <Mail className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary mb-2">
                Confirmação por Email
              </h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                Enviamos um email de confirmação com todos os detalhes do seu pedido. 
                Verifique sua caixa de entrada e spam.
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="bg-accent/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center space-x-2 text-accent mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium text-sm">Pagamento Seguro</span>
            </div>
            <p className="text-xs text-primary/70">
              Transação protegida pelo Pagar.me
            </p>
          </div>

          <div className="bg-accent/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center space-x-2 text-accent mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium text-sm">Processamento Rápido</span>
            </div>
            <p className="text-xs text-primary/70">
              Confirmação em poucos segundos
            </p>
          </div>
        </div>

        {/* Loading Dots */}
        {isProcessing && (
          <div className="flex justify-center items-center space-x-2 pt-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  );
}
