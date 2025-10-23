"use client";

import { forwardRef } from "react";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: "phone" | "cpf" | "cep";
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, ...props }, ref) => {
    const applyMask = (value: string, maskType: string) => {
      switch (maskType) {
        case "phone":
          // Remove tudo que não é número
          const phoneNumbers = value.replace(/\D/g, "");
          // Aplica máscara (XX) XXXXX-XXXX
          if (phoneNumbers.length <= 2) {
            return phoneNumbers;
          } else if (phoneNumbers.length <= 7) {
            return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2)}`;
          } else {
            return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2, 7)}-${phoneNumbers.slice(7, 11)}`;
          }
        
        case "cpf":
          // Remove tudo que não é número
          const cpfNumbers = value.replace(/\D/g, "");
          // Aplica máscara XXX.XXX.XXX-XX
          if (cpfNumbers.length <= 3) {
            return cpfNumbers;
          } else if (cpfNumbers.length <= 6) {
            return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3)}`;
          } else if (cpfNumbers.length <= 9) {
            return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6)}`;
          } else {
            return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
          }
        
        case "cep":
          // Remove tudo que não é número
          const cepNumbers = value.replace(/\D/g, "");
          // Aplica máscara XXXXX-XXX
          if (cepNumbers.length <= 5) {
            return cepNumbers;
          } else {
            return `${cepNumbers.slice(0, 5)}-${cepNumbers.slice(5, 8)}`;
          }
        
        default:
          return value;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value, mask);
      e.target.value = maskedValue;
      onChange?.(e);
    };

    return (
      <input
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";
