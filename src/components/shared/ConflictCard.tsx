import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { DetailedConflict } from '@/types';

interface ConflictCardProps {
  conflict: DetailedConflict;
  onViewRecommendation: (conflict: DetailedConflict) => void;
}

export const ConflictCard = ({ conflict, onViewRecommendation }: ConflictCardProps) => {
  return (
    <Card
      padding="md"
      className={`flex flex-col justify-between space-y-3.5 border-l-4 transition-all ${
        conflict.severity === 'CRITICAL'
          ? 'border-l-red-600 bg-red-50/10'
          : conflict.severity === 'HIGH'
          ? 'border-l-orange-500 bg-orange-50/10'
          : 'border-l-amber-500 bg-amber-50/10'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant={conflict.severity === 'CRITICAL' ? 'error' : 'warning'}>
            {conflict.severity}
          </Badge>
          <span className="text-[11px] font-mono text-slate-400">{conflict.category}</span>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {conflict.course}
          </h3>
          <p className="text-xs text-slate-500">{conflict.subject}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Assigned Room</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">{conflict.room}</p>
            {conflict.roomCapacity && (
              <p className="text-slate-500 text-[11px]">Cap: {conflict.roomCapacity}</p>
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Enrolled Students</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {conflict.studentCount ? `${conflict.studentCount} Students` : 'Cohort'}
            </p>
            <p className="text-slate-500 text-[11px] font-mono">{conflict.time}</p>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300">
          <p className="font-semibold">"{conflict.problem}"</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <Button
          variant={conflict.severity === 'CRITICAL' ? 'danger' : 'primary'}
          size="sm"
          onClick={() => onViewRecommendation(conflict)}
          icon={<Sparkles className="w-3.5 h-3.5" />}
        >
          View Recommendation
        </Button>
      </div>
    </Card>
  );
};

export default ConflictCard;
