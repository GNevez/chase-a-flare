import React from "react";

type FormSectionProps = {
  step: number;
  title: string;
  children: React.ReactNode;
};

export function FormSection({ step, title, children }: FormSectionProps) {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-black font-bold">
          {step}
        </span>
        <span>{title}</span>
      </h3>
      {children}
    </section>
  );
}
