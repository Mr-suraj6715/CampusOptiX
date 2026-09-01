import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function getUtilizationColor(value: number): string {
  if (value >= 85) return 'text-red-600 dark:text-red-400';
  if (value >= 70) return 'text-amber-600 dark:text-amber-400';
  if (value >= 50) return 'text-emerald-600 dark:text-emerald-400';
  return 'text-slate-500 dark:text-slate-400';
}

export function getUtilizationBg(value: number): string {
  if (value >= 85) return 'bg-red-500';
  if (value >= 70) return 'bg-amber-500';
  if (value >= 50) return 'bg-emerald-500';
  return 'bg-slate-300 dark:bg-slate-700';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
