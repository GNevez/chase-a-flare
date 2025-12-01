"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { CreditCard, Lock } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface CardFormProps {
  onCardDataChange?: (isValid: boolean) => void;
}

export interface CardFormHandle {
  getCardToken: () => Promise<{ token?: string; error?: string }>;
  getCardData: () => {
    holder_name: string;
    number: string;
    exp_month: string;
    exp_year: string;
    cvv: string;
  };
}

export const CardForm = forwardRef<CardFormHandle, CardFormProps>(
  ({ onCardDataChange }, ref) => {
    const [cardData, setCardData] = useState({
      holder_name: "",
      number: "",
      exp_month: "",
      exp_year: "",
      cvv: "",
    });

    const [errors, setErrors] = useState({
      holder_name: "",
      number: "",
      expiry: "",
      cvv: "",
    });

    useEffect(() => {
      const isValid =
        cardData.holder_name.length >= 3 &&
        cardData.number.replace(/\s/g, "").length === 16 &&
        cardData.exp_month.length === 2 &&
        cardData.exp_year.length === 2 &&
        cardData.cvv.length >= 3;

      onCardDataChange?.(isValid);
    }, [cardData, onCardDataChange]);

    const formatCardNumber = (value: string) => {
      const cleaned = value.replace(/\s/g, "");
      const chunks = cleaned.match(/.{1,4}/g);
      return chunks ? chunks.join(" ") : cleaned;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length <= 16) {
        setCardData((prev) => ({ ...prev, number: value }));
        setErrors((prev) => ({ ...prev, number: "" }));
      }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length <= 4) {
        const month = value.slice(0, 2);
        const year = value.slice(2, 4);
        setCardData((prev) => ({ ...prev, exp_month: month, exp_year: year }));
        setErrors((prev) => ({ ...prev, expiry: "" }));
      }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length <= 4) {
        setCardData((prev) => ({ ...prev, cvv: value }));
        setErrors((prev) => ({ ...prev, cvv: "" }));
      }
    };

    const validateCard = () => {
      const newErrors = {
        holder_name: "",
        number: "",
        expiry: "",
        cvv: "",
      };

      if (cardData.holder_name.length < 3) {
        newErrors.holder_name = "Nome inválido";
      }

      if (cardData.number.length !== 16) {
        newErrors.number = "Número do cartão inválido";
      }

      if (cardData.exp_month.length !== 2 || cardData.exp_year.length !== 2) {
        newErrors.expiry = "Data de validade inválida";
      } else {
        const month = parseInt(cardData.exp_month);
        if (month < 1 || month > 12) {
          newErrors.expiry = "Mês inválido";
        }
      }

      if (cardData.cvv.length < 3) {
        newErrors.cvv = "CVV inválido";
      }

      setErrors(newErrors);

      return !Object.values(newErrors).some((error) => error !== "");
    };

    useImperativeHandle(ref, () => ({
      getCardToken: async () => {
        if (!validateCard()) {
          return { error: "Dados do cartão inválidos" };
        }

        try {
          const keyResponse = await apiRequest.get("/api/payments/public-key");
          const { publicKey } = keyResponse.data;

          const tokenResponse = await fetch(
            "https://api.pagar.me/core/v5/tokens?appId=" + publicKey,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "card",
                card: {
                  number: cardData.number,
                  holder_name: cardData.holder_name,
                  exp_month: parseInt(cardData.exp_month),
                  exp_year: parseInt("20" + cardData.exp_year),
                  cvv: cardData.cvv,
                },
              }),
            }
          );

          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error("Erro na tokenização:", errorData);
            
            // Extrair mensagens de erro específicas do Pagar.me
            let errorMessage = "Erro ao processar cartão";
            
            if (errorData.errors) {
              // Pegar o primeiro erro do objeto errors
              const firstError = Object.values(errorData.errors)[0];
              if (Array.isArray(firstError) && firstError.length > 0) {
                errorMessage = firstError[0];
                
                // Traduzir mensagens comuns
                if (errorMessage.includes("not a valid card number")) {
                  errorMessage = "Número do cartão inválido";
                } else if (errorMessage.includes("exp_month")) {
                  errorMessage = "Mês de validade inválido";
                } else if (errorMessage.includes("exp_year")) {
                  errorMessage = "Ano de validade inválido";
                } else if (errorMessage.includes("cvv")) {
                  errorMessage = "CVV inválido";
                }
              }
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
            
            throw new Error(errorMessage);
          }

          const tokenData = await tokenResponse.json();
          return { token: tokenData.id };
        } catch (error: any) {
          console.error("Erro ao tokenizar cartão:", error);
          return { error: error.message || "Erro ao processar cartão" };
        }
      },
      getCardData: () => cardData,
    }));

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Lock className="w-4 h-4" />
          <span>Seus dados estão protegidos e criptografados</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Titular
          </label>
          <input
            type="text"
            placeholder="Como está no cartão"
            value={cardData.holder_name}
            onChange={(e) =>
              setCardData((prev) => ({
                ...prev,
                holder_name: e.target.value.toUpperCase(),
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
          {errors.holder_name && (
            <p className="text-sm text-red-600 mt-1">{errors.holder_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número do Cartão
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={formatCardNumber(cardData.number)}
              onChange={handleCardNumberChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-12"
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
          {errors.number && (
            <p className="text-sm text-red-600 mt-1">{errors.number}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validade
            </label>
            <input
              type="text"
              placeholder="MM/AA"
              value={
                cardData.exp_month +
                (cardData.exp_year ? "/" + cardData.exp_year : "")
              }
              onChange={handleExpiryChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
            {errors.expiry && (
              <p className="text-sm text-red-600 mt-1">{errors.expiry}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              value={cardData.cvv}
              onChange={handleCvvChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
            {errors.cvv && (
              <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
