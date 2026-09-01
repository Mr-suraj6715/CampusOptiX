import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-[12px] gap-1.5',
  md: 'h-9 px-4 text-[13px] gap-2',
  lg: 'h-11 px-5 text-[14px] gap-2',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? { backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }
      : variant === 'danger'
      ? { backgroundColor: '#ef4444', color: '#fff' }
      : {};

  const variantClassName =
    variant === 'primary'
      ? 'btn-inverse hover:opacity-90'
      : variant === 'secondary'
      ? 'btn-subtle border border-[--border-primary]'
      : variant === 'ghost'
      ? 'btn-subtle'
      : variant === 'danger'
      ? 'rounded-full font-semibold hover:opacity-90'
      : '';

  return (
    <button
      style={variantStyle}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 focus-ring disabled:opacity-40 disabled:cursor-not-allowed select-none',
        sizeClasses[size],
        variantClassName,
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children && <span className="truncate">{children}</span>}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
