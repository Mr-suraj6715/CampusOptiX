import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-3.5',
  md: 'p-5',
  lg: 'p-6',
};

export const Card = ({
  children,
  className,
  padding = 'md',
  hoverEffect = false,
  ...props
}: CardProps) => (
  <div
    className={cn(
      'surface-card rounded-2xl transition-all duration-150',
      hoverEffect && 'hover:border-[--border-secondary] hover:shadow-md cursor-pointer',
      paddingClasses[padding],
      className
    )}
    style={{
      backgroundColor: 'var(--surface-1)',
      borderColor: 'var(--border-primary)',
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex items-center justify-between gap-4 mb-3.5', className)}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={cn('text-[14px] font-semibold tracking-tight', className)} style={{ color: 'var(--text-primary)' }}>
    {children}
  </h3>
);

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn('text-[12px] mt-0.5', className)} style={{ color: 'var(--text-tertiary)' }}>
    {children}
  </p>
);

export default Card;
