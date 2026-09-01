import React from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'Failed to Load Resource',
  message = 'An unexpected error occurred while communicating with the campus service.',
  onRetry,
}: ErrorStateProps) => (
  <Card padding="lg" className="text-center py-12 space-y-4 max-w-md mx-auto my-8 border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/20">
    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
      <AlertTriangle className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
    </div>
    {onRetry && (
      <Button
        variant="secondary"
        size="sm"
        onClick={onRetry}
        icon={<RefreshCw className="w-3.5 h-3.5" />}
      >
        Retry Request
      </Button>
    )}
  </Card>
);

interface SuccessStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SuccessState = ({
  title,
  message,
  actionLabel = 'Continue to Dashboard',
  onAction,
}: SuccessStateProps) => (
  <Card padding="lg" className="text-center py-12 space-y-4 max-w-md mx-auto my-8 border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20">
    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
      <CheckCircle2 className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
    </div>
    {onAction && (
      <Button
        variant="primary"
        size="sm"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
  </Card>
);
