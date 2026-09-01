import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  containerClassName?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, containerClassName, className, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-[12px] font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'base-input rounded-xl pr-8 appearance-none text-[13px] cursor-pointer transition-all duration-150',
              error && 'border-red-500! focus:ring-red-500/20!',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-tertiary)' }}
          />
        </div>
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
