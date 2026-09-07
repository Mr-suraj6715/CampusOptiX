import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: number;
    label: string;
    direction?: 'up' | 'down' | 'neutral';
  };
  onClick?: () => void;
  className?: string;
}

export const KPICard = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  trend,
  onClick,
  className,
}: KPICardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'stat-card relative overflow-hidden flex flex-col justify-between select-none',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="section-label">
            {title}
          </p>
          <p
            className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div
            className="p-2.5 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div
          className="mt-3.5 pt-3 flex items-center justify-between text-[11px]"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={cn(
                  'flex items-center gap-0.5 font-semibold',
                  trend.direction === 'up'
                    ? 'text-emerald-500'
                    : trend.direction === 'down'
                      ? 'text-red-500'
                      : 'text-[--text-tertiary]'
                )}
              >
                {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
                {Math.abs(trend.value)}%
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>{trend.label}</span>
            </div>
          ) : (
            <span style={{ color: 'var(--text-tertiary)' }}>{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default KPICard;
