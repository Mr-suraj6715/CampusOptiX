import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      containerClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <span
              className="absolute left-3 flex items-center pointer-events-none"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {prefixIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'base-input rounded-xl text-[13px] transition-all duration-150',
              prefixIcon ? 'pl-9' : '',
              suffixIcon ? 'pr-9' : '',
              error && 'border-red-500! focus:ring-red-500/20!',
              className
            )}
            {...props}
          />
          {suffixIcon && (
            <span
              className="absolute right-3 flex items-center pointer-events-none"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {suffixIcon}
            </span>
          )}
        </div>
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
