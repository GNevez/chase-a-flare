"use client";

import { FormSection } from "@/components/checkout/FormSection";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { FormInput } from "@/components/checkout/FormInput";
import { MaskedInput } from "@/components/checkout/MaskedInput";
import { CardForm, CardFormHandle } from "@/components/checkout/CardForm";
import { PixPayment } from "@/components/checkout/PixPayment";
import { FormSelect } from "@/components/checkout/FormSelect";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrCode, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useDiscounts } from "@/hooks/useDiscounts";
import { useCoupon } from "@/hooks/useCoupon";
import { usePagarme } from "@/hooks/usePagarme";
import { toast } from "sonner";
import { useClienteVerification } from "@/hooks/useClienteVerification";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmClientModal from "@/components/checkout/ConfirmClientModal";
import ConfirmCheckoutModal from "@/components/checkout/ConfirmCheckoutModal";

interface ClienteExistente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
}

export default function CheckoutPage() {
  const FormSchema = z.object({
    name: z.string().min(2, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    phone: z
      .string()
      .refine((v) => !v || v.replace(/\D/g, "").length >= 10, {
        message: "Telefone deve ter pelo menos 10 dígitos",
      })
      .optional(),
    cpf: z
      .string()
      .refine((v) => !v || v.replace(/\D/g, "").length === 11, {
        message: "CPF deve ter 11 dígitos",
      })
      .optional(),
    zip: z
      .string()
      .min(1, "Informe o CEP")
      .refine((v) => v.replace(/\D/g, "").length === 8, {
        message: "CEP deve ter 8 dígitos",
      }),
    address: z.string().min(5, "Endereço muito curto"),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().min(2, "Cidade muito curta"),
    state: z.string().min(2, "Estado muito curto"),
    installments: z.string().optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cartao_de_credito");
  const [showConfirmClientModal, setShowConfirmClientModal] = useState(false);
  const [showConfirmCheckoutModal, setShowConfirmCheckoutModal] =
    useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [clienteExistente, setClienteExistente] =
    useState<ClienteExistente | null>(null);
  const [atualizarCliente, setAtualizarCliente] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const cardFormRef = useRef<CardFormHandle>(null);

  const { cart, isLoading } = useCart();
  const { calcularTotal } = useDiscounts();
  const { couponDiscount, couponCode, applyCoupon, clearCoupon, isApplying } =
    useCoupon();
  const { verificarCpf, isVerifying } = useClienteVerification();
  const { isCreatingOrder, createOrder: createPagarmeOrder } = usePagarme();
  const [couponInput, setCouponInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    onChange: onChangeName,
    onBlur: onBlurName,
    ref: refName,
  } = register("name");
  const {
    onChange: onChangeEmail,
    onBlur: onBlurEmail,
    ref: refEmail,
  } = register("email");
  const {
    onChange: onChangePhone,
    onBlur: onBlurPhone,
    ref: refPhone,
  } = register("phone");
  const {
    onChange: onChangeCpf,
    onBlur: onBlurCpf,
    ref: refCpf,
  } = register("cpf");
  const {
    onChange: onChangeZip,
    onBlur: onBlurZip,
    ref: refZip,
  } = register("zip");
  const {
    onChange: onChangeAddress,
    onBlur: onBlurAddress,
    ref: refAddress,
  } = register("address");
  const {
    onChange: onChangeNumber,
    onBlur: onBlurNumber,
    ref: refNumber,
  } = register("number");
  const {
    onChange: onChangeComplement,
    onBlur: onBlurComplement,
    ref: refComplement,
  } = register("complement");
  const {
    onChange: onChangeNeighborhood,
    onBlur: onBlurNeighborhood,
    ref: refNeighborhood,
  } = register("neighborhood");
  const {
    onChange: onChangeCity,
    onBlur: onBlurCity,
    ref: refCity,
  } = register("city");
  const {
    onChange: onChangeState,
    onBlur: onBlurState,
    ref: refState,
  } = register("state");
  const {
    onChange: onChangeInstallments,
    onBlur: onBlurInstallments,
    ref: refInstallments,
  } = register("installments");

  useEffect(() => {
    if (!isLoading && cart && cart.itens.length <= 0) {
      window.location.href = "/carrinho";
    }
  }, [cart, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-white font-display text-primary pt-24">
        <main className="container mx-auto px-4 lg:px-8 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-16 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!cart || cart.itens.length === 0) {
    return null;
  }

  const subtotal = cart.subtotal;
  const itemCount = cart.totalItens;
  const shipping = 10.0;
  const { total: totalAfterPromo, desconto: promoDiscount } = calcularTotal(
    subtotal,
    itemCount
  );
  const totalBaseForCoupon = totalAfterPromo + shipping;
  const total = Math.max(0, totalBaseForCoupon - couponDiscount);

  const cartAllowedMaxParcelas = (() => {
    if (!cart || !cart.itens || cart.itens.length === 0) return 12;
    const values = cart.itens.map(
      (it: any) => it.produtoMaxParcelas ?? Infinity
    );
    const min = values.reduce(
      (acc: number, v: number) => Math.min(acc, v),
      Infinity
    );
    return isFinite(min) ? Math.max(1, min) : 12;
  })();

  const cartMaxTaxa = (() => {
    if (!cart || !cart.itens || cart.itens.length === 0) return 0;
    const taxas = cart.itens.map((it: any) => it.produtoTaxaJuros ?? 0);
    return taxas.length ? Math.max(...taxas) : 0;
  })();

  const dynamicInstallmentOptions: string[] = [];
  for (let i = 1; i <= cartAllowedMaxParcelas; i++) {
    const taxa = i > 1 ? cartMaxTaxa : 0;
    const subtotalItems = cart.itens.reduce(
      (acc: number, it: any) =>
        acc + (it.produtoPreco ?? 0) * (it.quantidade ?? 1),
      0
    );
    const totalWithInterest = subtotalItems * (1 + taxa);
    const per = totalWithInterest / i;

    if (taxa <= 0 || i === 1) {
      dynamicInstallmentOptions.push(
        `${i}x de R$ ${per.toFixed(2).replace(".", ",")} sem juros`
      );
    } else {
      dynamicInstallmentOptions.push(
        `${i}x c/ juros de R$ ${per.toFixed(2).replace(".", ",")}`
      );
    }
  }

  const handleUseNewClient = () => {
    setShowConfirmClientModal(false);
    setAtualizarCliente(true);
    setShowConfirmCheckoutModal(true);
  };

  const handleUseExistingClient = () => {
    setShowConfirmClientModal(false);
    setAtualizarCliente(false);
    if (clienteExistente) {
      setPendingCheckoutData({
        ...pendingCheckoutData,
        nome: clienteExistente.nome,
        email: clienteExistente.email,
        telefone: clienteExistente.telefone || "",
        cpf: clienteExistente.cpf,
      });
    }
    setShowConfirmCheckoutModal(true);
  };

  const handleFinalConfirm = async () => {
    try {
      if (!pendingCheckoutData) return;

      setIsProcessingPayment(true);

      let cardToken = null;

      if (pendingCheckoutData.metodoPagamento === "cartao_de_credito") {
        if (!cardFormRef.current) {
          toast.error("Formulário de cartão não inicializado");
          setIsProcessingPayment(false);
          return;
        }

        const tokenResult = await cardFormRef.current.getCardToken();
        if (tokenResult.error) {
          toast.error(tokenResult.error);
          setIsProcessingPayment(false);
          return;
        }

        cardToken = tokenResult.token;
      }

      const payload = {
        nome: pendingCheckoutData.nome,
        email: pendingCheckoutData.email,
        telefone: pendingCheckoutData.telefone || "",
        cpf: pendingCheckoutData.cpf || "",
        cep: pendingCheckoutData.cep,
        logradouro: pendingCheckoutData.logradouro,
        numero: pendingCheckoutData.numero,
        complemento: pendingCheckoutData.complemento || "",
        bairro: pendingCheckoutData.bairro,
        cidade: pendingCheckoutData.cidade,
        estado: pendingCheckoutData.estado,
        metodoPagamento: pendingCheckoutData.metodoPagamento,
        precoFrete: shipping,
        totalEnviado: pendingCheckoutData.totalEnviado,
        parcelasNum: pendingCheckoutData.parcelasNum || 1,
        observacoes: null,
        descontoPorUnidade: promoDiscount,
        descontoCupom: couponDiscount,
        atualizarCliente: atualizarCliente,
        cardToken: cardToken,
      };

      const orderData = await createPagarmeOrder(payload);

      if (!orderData) {
        toast.error("Erro ao criar pedido no Pagar.me");
        setIsProcessingPayment(false);
        setShowConfirmCheckoutModal(false);
        return;
      }

      const codigoPedido = orderData.orderId;
      console.log(
        "[Checkout] Método de pagamento:",
        pendingCheckoutData.metodoPagamento
      );
      console.log("[Checkout] Order data:", orderData);

      // Redirecionar baseado no método de pagamento
      if (pendingCheckoutData.metodoPagamento === "pix") {
        // Verificar se tem dados do PIX
        if (orderData.pix && orderData.pix.qr_code) {
          console.log("[Checkout] PIX QR Code found, redirecting to /pix");
          toast.success("Pedido criado! QR Code PIX gerado!");
          setShowConfirmCheckoutModal(false);
          setIsProcessingPayment(false);
          router.push(`/carrinho/checkout/pix/${codigoPedido}`);
          return;
        } else {
          toast.error("Pedido Falhou! Dados do PIX não encontrados.");
          // setShowConfirmCheckoutModal(false);
          // setIsProcessingPayment(false);
          router.push(`/carrinho/checkout/falha/${codigoPedido}`);
          return;
        }
      }

      // Cartão de crédito vai para processando
      toast.success("Pedido criado! Processando pagamento...");
      setShowConfirmCheckoutModal(false);
      setIsProcessingPayment(false);
      router.push(`/carrinho/checkout/processando/${codigoPedido}`);
    } catch (error: any) {
      console.error("Erro ao processar pedido:", error);
      toast.error(error.message || "Não foi possível processar o pedido");
      setIsProcessingPayment(false);
    }
  };

  const handleCheckout = async (values: FormValues) => {
    try {
      const checkoutData = {
        nome: values.name.trim(),
        email: values.email.trim(),
        telefone: values.phone || "",
        cpf: values.cpf || "",
        cep: values.zip.replace(/\D/g, ""),
        logradouro: values.address.trim(),
        numero: values.number || "S/N",
        complemento: values.complement || "",
        bairro: values.neighborhood || "Centro",
        cidade: values.city.trim(),
        estado: values.state.trim(),
        metodoPagamento: paymentMethod,
        installmentsSelected: values.installments || null,
      };

      let parcelasNum = 1;
      if (checkoutData.installmentsSelected) {
        const m = checkoutData.installmentsSelected.match(/^\s*(\d+)/);
        parcelasNum = m ? parseInt(m[1], 10) : 1;
      }

      const subtotalItems = cart.itens.reduce(
        (acc: number, it: any) =>
          acc + (it.produtoPreco ?? 0) * (it.quantidade ?? 1),
        0
      );
      const subtotalComPromo = subtotalItems - promoDiscount;
      const taxaUsada = parcelasNum > 1 ? cartMaxTaxa : 0;
      const totalComJuros = subtotalComPromo * (1 + taxaUsada);
      const totalFinal = totalComJuros + shipping - couponDiscount;

      const checkoutDataWithTotals = {
        ...checkoutData,
        parcelasNum,
        totalEnviado: Math.max(0, totalFinal),
      };

      if (
        checkoutData.cpf &&
        checkoutData.cpf.replace(/\D/g, "").length === 11
      ) {
        const clienteExiste = await verificarCpf(checkoutData.cpf);

        if (clienteExiste) {
          setClienteExistente(clienteExiste);
          setPendingCheckoutData(checkoutDataWithTotals);
          setShowConfirmClientModal(true);
          return;
        }
      }

      setPendingCheckoutData(checkoutDataWithTotals);
      setShowConfirmCheckoutModal(true);
    } catch (error) {
      toast.error("Não foi possível processar o pedido");
    }
  };

  const onApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    await applyCoupon(couponInput.trim(), totalBaseForCoupon);
  };

  return (
    <div className="bg-white font-display text-primary pt-24">
      <main className="container mx-auto px-4 lg:px-8 flex-grow">
        <form
          id="checkoutForm"
          noValidate
          onSubmit={handleSubmit(handleCheckout)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-24"
        >
          <div className="lg:col-span-2 pb-12">
            <div className="mb-8">
              <nav className="text-sm font-light text-neutral-500">
                <Link className="hover:text-primary" href="/carrinho">
                  Carrinho
                </Link>
                <span> / </span>
                <span className="font-medium text-neutral-800">Checkout</span>
              </nav>
              <h2 className="text-4xl font-bold mt-2 text-neutral-900">
                Checkout
              </h2>
            </div>
            <div className="space-y-12">
              <FormSection title="Identificação" step={1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Nome Completo"
                    placeholder="Digite seu nome"
                    name="name"
                    onChange={onChangeName}
                    onBlur={onBlurName}
                    ref={refName}
                    containerClassName="col-span-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 col-span-2">
                      {errors.name.message as string}
                    </p>
                  )}
                  <FormInput
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    name="email"
                    type="email"
                    onChange={onChangeEmail}
                    onBlur={onBlurEmail}
                    ref={refEmail}
                    containerClassName="col-span-2"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 col-span-2">
                      {errors.email.message as string}
                    </p>
                  )}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <MaskedInput
                      mask="phone"
                      placeholder="(XX) XXXXX-XXXX"
                      name="phone"
                      type="tel"
                      onChange={onChangePhone}
                      onBlur={onBlurPhone}
                      ref={refPhone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">
                        {errors.phone.message as string}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <MaskedInput
                      mask="cpf"
                      placeholder="000.000.000-00"
                      name="cpf"
                      onChange={onChangeCpf}
                      onBlur={onBlurCpf}
                      ref={refCpf}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                    {errors.cpf && (
                      <p className="text-sm text-red-600">
                        {errors.cpf.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </FormSection>

              <div className="border-t border-primary/20"></div>

              <FormSection title="Entrega" step={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP
                    </label>
                    <MaskedInput
                      mask="cep"
                      placeholder="00000-000"
                      name="zip"
                      onChange={onChangeZip}
                      onBlur={onBlurZip}
                      ref={refZip}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                    {errors.zip && (
                      <p className="text-sm text-red-600">
                        {errors.zip.message as string}
                      </p>
                    )}
                  </div>
                  <FormInput
                    label="Endereço"
                    placeholder="Rua, número e bairro"
                    name="address"
                    onChange={onChangeAddress}
                    onBlur={onBlurAddress}
                    ref={refAddress}
                    containerClassName="col-span-2"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 col-span-2">
                      {errors.address.message as string}
                    </p>
                  )}
                  <FormInput
                    label="Número"
                    placeholder="123"
                    name="number"
                    onChange={onChangeNumber}
                    onBlur={onBlurNumber}
                    ref={refNumber}
                  />
                  <FormInput
                    label="Complemento"
                    placeholder="Apto, casa, etc."
                    name="complement"
                    onChange={onChangeComplement}
                    onBlur={onBlurComplement}
                    ref={refComplement}
                  />
                  <FormInput
                    label="Bairro"
                    placeholder="Seu bairro"
                    name="neighborhood"
                    onChange={onChangeNeighborhood}
                    onBlur={onBlurNeighborhood}
                    ref={refNeighborhood}
                  />
                  <FormInput
                    label="Cidade"
                    placeholder="Sua cidade"
                    name="city"
                    onChange={onChangeCity}
                    onBlur={onBlurCity}
                    ref={refCity}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">
                      {errors.city.message as string}
                    </p>
                  )}
                  <FormInput
                    label="Estado"
                    placeholder="Seu estado"
                    name="state"
                    onChange={onChangeState}
                    onBlur={onBlurState}
                    ref={refState}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600">
                      {errors.state.message as string}
                    </p>
                  )}
                </div>
              </FormSection>

              <div className="border-t border-primary/20"></div>

              <FormSection title="Pagamento" step={3}>
                <div className="flex flex-wrap gap-3 mb-6">
                  {["cartao_de_credito", "pix"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-neutral-300 py-3 px-5 has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-all"
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      {method === "cartao_de_credito" ? (
                        <CreditCard className="w-5 h-5" />
                      ) : (
                        <QrCode className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">
                        {method === "cartao_de_credito"
                          ? "Cartão de Crédito"
                          : "PIX"}
                      </span>
                    </label>
                  ))}
                </div>

                {paymentMethod === "cartao_de_credito" && (
                  <div className="space-y-6">
                    <CardForm ref={cardFormRef} />

                    <FormSelect
                      label="Parcelas"
                      name="installments"
                      onChange={onChangeInstallments}
                      onBlur={onBlurInstallments}
                      ref={refInstallments}
                      options={dynamicInstallmentOptions}
                      containerClassName="col-span-2"
                      placeholder="Selecione o número de parcelas"
                    />
                  </div>
                )}

                {paymentMethod === "pix" && (
                  <div className="flex items-center gap-4 rounded-lg border-2 border-accent bg-accent/10 p-6 transition-all">
                    <QrCode className="h-10 w-10 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary mb-1">
                        Pagamento via PIX
                      </p>
                      <p className="text-sm text-primary/70">
                        Após finalizar o pedido, você receberá um QR Code para
                        efetuar o pagamento pelo app do seu banco.
                      </p>
                    </div>
                  </div>
                )}
              </FormSection>
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={cart.itens.map((item) => ({
                id: item.id,
                name: item.produtoNome,
                quantity: item.quantidade,
                price: item.produtoPreco,
                image: `http://localhost:5006${item.produtoImagem}`,
                maxParcelas: (item as any).produtoMaxParcelas,
                taxaJuros: (item as any).produtoTaxaJuros,
              }))}
              subtotal={subtotal}
              promotionDiscount={promoDiscount}
              couponDiscount={couponDiscount}
              couponCode={couponCode}
              shipping={shipping}
              total={total}
              installmentsSelected={
                paymentMethod === "pix" ? null : watch("installments")
              }
              formId="checkoutForm"
              isProcessing={isProcessingPayment || isCreatingOrder}
            />
          </div>
        </form>

        {/* Modal de confirmação de cliente existente */}
        {clienteExistente && (
          <ConfirmClientModal
            isOpen={showConfirmClientModal}
            onClose={() => setShowConfirmClientModal(false)}
            clienteExistente={clienteExistente}
            onUseExisting={handleUseExistingClient}
            onUseNew={handleUseNewClient}
          />
        )}

        {/* Modal de confirmação final do checkout */}
        {pendingCheckoutData && (
          <ConfirmCheckoutModal
            isOpen={showConfirmCheckoutModal}
            onClose={() => setShowConfirmCheckoutModal(false)}
            onConfirm={handleFinalConfirm}
            isLoading={isProcessingPayment || isCreatingOrder}
            checkoutData={pendingCheckoutData}
          />
        )}

        {/* Modal PIX */}
        {showPixModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
              <PixPayment
                pixData={pixData}
                orderId={pendingCheckoutData?.codigoPedido}
                onClose={() => {
                  setShowPixModal(false);
                  router.push("/");
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
