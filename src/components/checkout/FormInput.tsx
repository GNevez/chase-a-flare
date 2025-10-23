import { forwardRef } from "react";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  containerClassName?: string;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, containerClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={containerClassName}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-600 mb-2"
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          placeholder={props.placeholder as string}
          className={`w-full bg-background-light border border-neutral-300 rounded-lg p-3 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
