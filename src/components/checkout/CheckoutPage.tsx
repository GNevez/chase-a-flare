"use client";

import { FormSection } from "./FormSection";
import { OrderSummary } from "./OrderSummary";
import { FormInput } from "./FormInput";
import { MaskedInput } from "./MaskedInput";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FormSelect } from "./FormSelect";
import { QrCode, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useDiscounts } from "@/hooks/useDiscounts";
import { useCoupon } from "@/hooks/useCoupon";
import { useToast } from "@/hooks/use-toast";
import { useCheckout } from "@/hooks/useCheckout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const installmentOptions = [
  "1x sem juros",
  "2x sem juros",
  "3x sem juros",
  "4x com juros",
  "5x com juros",
];

export function CheckoutPage() {
  const FormSchema = z.object({
    name: z.string().min(2, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    phone: z
      .string()
      .optional()
      .transform((v) => (v ? v : ""))
      .refine((v) => !v || v.replace(/\D/g, "").length >= 10, {
        message: "Telefone deve ter pelo menos 10 dígitos",
      }),
    cpf: z
      .string()
      .optional()
      .transform((v) => (v ? v : ""))
      .refine((v) => !v || v.replace(/\D/g, "").length === 11, {
        message: "CPF deve ter 11 dígitos",
      }),
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
    card_holder: z.string().optional(),
    card_number: z.string().optional(),
    expiry_date: z.string().optional(),
    cvv: z.string().optional(),
    installments: z.string().optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const [paymentMethod, setPaymentMethod] = useState("cartao_de_credito");
  const { cart, isLoading } = useCart();
  const { toast } = useToast();
  const { calcularTotal } = useDiscounts();
  const { couponDiscount, couponCode, applyCoupon, clearCoupon, isApplying } =
    useCoupon();
  const { isProcessing, createOrder } = useCheckout();
  const [couponInput, setCouponInput] = useState("");

  const {
    register,
    handleSubmit,
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
    onChange: onChangeCardHolder,
    onBlur: onBlurCardHolder,
    ref: refCardHolder,
  } = register("card_holder");
  const {
    onChange: onChangeCardNumber,
    onBlur: onBlurCardNumber,
    ref: refCardNumber,
  } = register("card_number");
  const {
    onChange: onChangeExpiryDate,
    onBlur: onBlurExpiryDate,
    ref: refExpiryDate,
  } = register("expiry_date");
  const {
    onChange: onChangeCvv,
    onBlur: onBlurCvv,
    ref: refCvv,
  } = register("cvv");
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

  const onApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    await applyCoupon(couponInput.trim(), totalBaseForCoupon);
  };

  const handleCheckout = async (values: FormValues) => {
    try {
      // Validações básicas
      const nome = values.name;
      const email = values.email;
      const telefone = values.phone || "";
      const cpf = values.cpf || "";
      const cep = values.zip;
      const logradouro = values.address;
      const numero = values.number || "";
      const cidade = values.city;
      const estado = values.state;

      // Regras acima agora são cobertas por Zod (mantemos limpeza abaixo)

      const checkoutData = {
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone || null,
        cpf: cpf || null,
        cep: cep.replace(/\D/g, ""),
        logradouro: logradouro.trim(),
        numero: numero || "S/N",
        complemento: values.complement || null,
        bairro: values.neighborhood || "Centro",
        cidade: cidade.trim(),
        estado: estado.trim(),
        metodoPagamento: paymentMethod,
        precoFrete: null, // por enquanto null
        observacoes: null,
      };

      const result = await createOrder({
        ...checkoutData,
        descontoPorUnidade: promoDiscount,
        descontoCupom: couponDiscount,
      });

      if (!result.success) throw new Error(result.error);

      // Stripe
      toast({
        title: "Checkout realizado!",
        description: "Seu pedido foi processado com sucesso",
      });

      window.location.href = "/checkout/success";
    } catch (error) {
      toast({
        title: "Erro no checkout",
        description: "Não foi possível processar o pedido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white font-display text-primary pt-24">
      <main className="container mx-auto px-4 lg:px-8 flex-grow">
        <form
          id="checkoutForm"
          noValidate
          onSubmit={handleSubmit(handleCheckout, (invalid) => {
            // Debug rápido de validação
            console.debug("invalid submit", invalid);
          })}
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
                    <p className="text-sm text-red-600">
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
                    <p className="text-sm text-red-600">
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
                    <p className="text-sm text-red-600">
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
                      className="flex items-center cursor-pointer rounded-lg border-2 border-neutral-300 py-2 px-4 has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-all"
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.toLowerCase().replace(" ", "_")}
                        checked={
                          paymentMethod ===
                          method.toLowerCase().replace(" ", "_")
                        }
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">
                        {method === "cartao_de_credito"
                          ? "Cartão de Crédito"
                          : method == "pix"
                          ? "Pix"
                          : ""}
                      </span>
                    </label>
                  ))}
                </div>

                {paymentMethod === "cartao_de_credito" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Nome do Titular"
                      placeholder="Como está no cartão"
                      name="card_holder"
                      onChange={onChangeCardHolder}
                      onBlur={onBlurCardHolder}
                      ref={refCardHolder}
                      containerClassName="col-span-2"
                    />
                    <FormInput
                      label="Número do Cartão"
                      placeholder="•••• •••• •••• ••••"
                      name="card_number"
                      onChange={onChangeCardNumber}
                      onBlur={onBlurCardNumber}
                      ref={refCardNumber}
                      containerClassName="col-span-2"
                    />
                    <FormInput
                      label="Data de Validade"
                      placeholder="MM/AA"
                      name="expiry_date"
                      onChange={onChangeExpiryDate}
                      onBlur={onBlurExpiryDate}
                      ref={refExpiryDate}
                    />
                    <FormInput
                      label="CVV"
                      placeholder="•••"
                      name="cvv"
                      onChange={onChangeCvv}
                      onBlur={onBlurCvv}
                      ref={refCvv}
                    />
                    <FormSelect
                      label="Parcelas"
                      name="installments"
                      onChange={onChangeInstallments}
                      onBlur={onBlurInstallments}
                      ref={refInstallments}
                      options={installmentOptions}
                      containerClassName="col-span-2"
                    />
                  </div>
                )}

                {paymentMethod === "pix" && (
                  <div className="flex items-center gap-4 rounded-lg border-2 border-accent bg-accent/10 p-4 transition-all">
                    <QrCode className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium text-primary">
                      Prossiga para realizar o pagamento pelo aplicativo do seu
                      banco.
                    </p>
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
              }))}
              subtotal={subtotal}
              promotionDiscount={promoDiscount}
              couponDiscount={couponDiscount}
              couponCode={couponCode}
              shipping={shipping}
              total={total}
              formId="checkoutForm"
              isProcessing={isProcessing}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
