import { Zap, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { OptimizationRecommendation } from '@/types';
import { cn } from '@/utils/cn';

export interface OptimizationCardProps {
  item: OptimizationRecommendation;
  onOptimize?: (item: OptimizationRecommendation) => void;
  compact?: boolean;
}

export const OptimizationCard = ({
  item,
  onOptimize,
  compact = false,
}: OptimizationCardProps) => {
  const impactPill =
    item.impact === 'high'
      ? 'pill-error'
      : item.impact === 'medium'
      ? 'pill-warning'
      : 'pill-neutral';

  return (
    <div
      className="surface-card rounded-2xl p-4 transition-all duration-150"
      style={{
        backgroundColor: 'var(--surface-1)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="p-1 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)' }}
            >
              <Zap className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-[13px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </h4>
            <span className={cn('pill', impactPill)}>{item.impact} impact</span>
            <span className="pill pill-neutral">{item.category}</span>
          </div>

          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {item.description}
          </p>

          {item.estimatedSaving && (
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Est. Impact: {item.estimatedSaving}</span>
            </div>
          )}

          {!compact && item.affectedEntities.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                Affected:
              </span>
              {item.affectedEntities.map((ent, idx) => (
                <span
                  key={idx}
                  className="pill pill-neutral font-mono text-[10px]"
                >
                  {ent}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center sm:self-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOptimize?.(item)}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {item.actionLabel || 'Optimize'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationCard;
