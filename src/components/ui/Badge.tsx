import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'purple'
  | 'orange'
  | 'slate'
  | 'danger';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'pill-neutral',
  slate: 'pill-neutral',
  success: 'pill-success',
  warning: 'pill-warning',
  error: 'pill-error',
  danger: 'pill-error',
  info: 'pill-info',
  purple: 'pill-info',
  orange: 'pill-warning',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-zinc-400',
  slate: 'bg-zinc-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export const Badge = ({
  variant = 'default',
  children,
  className,
  dot = false,
}: BadgeProps) => (
  <span className={cn('pill select-none', variantClasses[variant], className)}>
    {dot && (
      <span
        className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
      />
    )}
    {children}
  </span>
);

export default Badge;
