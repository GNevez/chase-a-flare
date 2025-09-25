"use client";
import React from "react";
import { Users, CreditCard, Check } from "lucide-react";

export const BenefitsBar: React.FC = () => {
  const benefits = [
    {
      icon: <Check className="w-4 h-4" />,
      text: "FRETE GRÁTIS",
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "100.000+ CLIENTES SATISFEITOS",
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      text: "ATÉ 3X SEM JUROS",
    },
  ];

  return (
    <div className="bg-primary text-white py-3">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex justify-center items-center space-x-2 md:space-x-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 md:space-x-2"
            >
              {benefit.icon}
              <span className="text-[10px] md:text-sm font-medium whitespace-nowrap">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
