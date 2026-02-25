import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-gray-700">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`rounded-xl border bg-white/60 px-4 py-2.5 text-sm transition-all duration-200
            placeholder:text-gray-400 resize-none
            focus:bg-white focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10
            hover:border-gray-400
            ${error ? 'border-red-300' : 'border-gray-200'}
            ${className}`}
          rows={3}
          {...rest}
        />
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export default Textarea;
