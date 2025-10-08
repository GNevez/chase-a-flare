// @/components/checkout/CheckoutPage.tsx
"use client";

import { FormSection } from "./FormSection";
import { OrderSummary } from "./OrderSummary";
import { FormInput } from "./FormInput";
import { useState } from "react";
import Link from "next/link";
import { FormSelect } from "./FormSelect";
import { QrCode } from "lucide-react";

// Dados de exemplo que viriam do carrinho/contexto
const orderItems = [
  {
    id: 1,
    name: "Classic Aviator",
    quantity: 1,
    price: 75.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8b3vPuf6JxmXygueyBfRuQy1UjzT9Wsutoc6fpXxJgNERXvkuqlZ1PW-mva2e-jM3I_bZOS2TMnuzvVZ8E0VL_drgnlWSgUnb58RfaqTatc-GXkBbKDv0zV8Q00O3PqRcBhdzzV2QxlEK5leXGRzJ44smMWYAbPvxOIFyfnCRwN9YvA5t55kXpXsXh7HBCP9DYjFsdKeJDxvNjLKFREr4SJHxk_a7QPOZYdvBhOB0tgMrOMYwiUfNLUyJlx-uOjNR22ljYpCMA_k",
  },
  {
    id: 2,
    name: "Retro Round",
    quantity: 1,
    price: 75.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHvSoyS_bJkost30BwAL8jknVeKNRgWURSM1pzDz2xW7edvVfUBvaBP4co2HHKpLBRkLNRZ5LOlbrKDtROZxt1DqdQ3k4xdYPTcmje4KYrzrbyTrih3gKIeRuiTKIS7Eia134bHSIwuygCtOtPh96yQYebeyAGCoDzsgtmAhGGydA7lYSi_uTgkIgqC5HUznZY-o5qICHTWIL5LUA4i4UvFmQOEnE8SW-xKO_GenGlh2yW9aqq2UCAWcCmEbP43y-1a0S0mxVeqjk",
  },
];

const installmentOptions = [
  "1x sem juros",
  "2x sem juros",
  "3x sem juros",
  "4x com juros",
  "5x com juros",
];

export function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cartao_de_credito");

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 10.0; // Exemplo estático
  const total = subtotal + shipping;

  return (
    // TEMA BRANCO FORÇADO e PADDING APLICADO CONFORME SOLICITADO
    <div className="bg-white font-display text-primary pt-24">
      <main className="container mx-auto px-4 lg:px-8 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-16 pt-24">
        {/* Coluna Principal: Formulários */}
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
            {/* Seção 1: Identificação */}
            <FormSection title="Identificação" step={1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nome Completo"
                  placeholder="Digite seu nome"
                  name="name"
                  containerClassName="col-span-2"
                />
                <FormInput
                  label="E-mail"
                  placeholder="Digite seu e-mail"
                  name="email"
                  type="email"
                  containerClassName="col-span-2"
                />
                <FormInput
                  label="Telefone"
                  placeholder="(XX) XXXXX-XXXX"
                  name="phone"
                  type="tel"
                />
                <FormInput
                  label="CPF"
                  placeholder="000.000.000-00"
                  name="cpf"
                />
              </div>
            </FormSection>

            <div className="border-t border-primary/20"></div>

            {/* Seção 2: Entrega */}
            <FormSection title="Entrega" step={2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Endereço"
                  placeholder="Rua, número e bairro"
                  name="address"
                  containerClassName="col-span-2"
                />
                <FormInput
                  label="Cidade"
                  placeholder="Sua cidade"
                  name="city"
                />
                <FormInput
                  label="Estado"
                  placeholder="Seu estado"
                  name="state"
                />
                <FormInput label="CEP" placeholder="00000-000" name="zip" />
                <FormInput label="País" placeholder="Seu país" name="country" />
              </div>
            </FormSection>

            <div className="border-t border-primary/20"></div>

            {/* Seção 3: Pagamento */}
            {/* --- SEÇÃO DE PAGAMENTO MODIFICADA --- */}
            <FormSection title="Pagamento" step={3}>
              <div className="flex flex-wrap gap-3 mb-6">
                {/* Opção "Boleto" foi removida do array */}
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
                        paymentMethod === method.toLowerCase().replace(" ", "_")
                      }
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{method === "cartao_de_credito" ? "Cartão de Crédito" : method == "pix"  ? "Pix" : ""}</span>
                  </label>
                ))}
              </div>

              {/* Formulário do Cartão de Crédito ATUALIZADO */}
              {paymentMethod === "cartao_de_credito" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Nome do Titular"
                    placeholder="Como está no cartão"
                    name="card_holder"
                    containerClassName="col-span-2"
                  />
                  <FormInput
                    label="Número do Cartão"
                    placeholder="•••• •••• •••• ••••"
                    name="card_number"
                    containerClassName="col-span-2"
                  />
                  <FormInput
                    label="Data de Validade"
                    placeholder="MM/AA"
                    name="expiry_date"
                  />
                  <FormInput label="CVV" placeholder="•••" name="cvv" />
                  <FormSelect
                    label="Parcelas"
                    name="installments"
                    options={installmentOptions}
                    containerClassName="col-span-2"
                  />
                </div>
              )}

              {/* Card de Mensagem para o PIX */}
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
        </div >

        {/* Coluna Lateral: Resumo do Pedido */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={orderItems}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
        </div>
      </main>
    </div>
  );
}
