import { forwardRef, type SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, placeholder, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-gray-700">{label}</label>
        )}
        <select
          ref={ref}
          className={`rounded-xl border bg-white/60 px-4 py-2.5 text-sm transition-all duration-200
            focus:bg-white focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10
            hover:border-gray-400
            ${error ? 'border-red-300' : 'border-gray-200'}
            ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;
