import { forwardRef } from "react";

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  containerClassName?: string;
};

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      name,
      options,
      placeholder,
      containerClassName = "",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-600 mb-2"
        >
          {label}
        </label>
        <select
          id={name}
          name={name}
          ref={ref}
          className={`w-full bg-white border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all ${className}`}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
