import { cn, getUtilizationBg } from '@/utils/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorByValue?: boolean;
  color?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'sm',
  colorByValue = true,
  color,
}: ProgressBarProps) => {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = color || (colorByValue ? getUtilizationBg(percent) : 'bg-blue-500');

  const sizeClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className={cn('flex items-center gap-2.5 w-full', className)}>
      <div className={cn('flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', sizeClass)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-9 text-right tabular-nums">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
