import React from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pills',
}: TabsProps) => {
  if (variant === 'pills') {
    return (
      <div
        className={cn('inline-flex items-center gap-1 p-1 rounded-full', className)}
        style={{
          backgroundColor: 'var(--surface-2)',
          border: '1px solid var(--border-primary)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full transition-all duration-150 cursor-pointer focus-ring select-none',
                isActive
                  ? 'btn-inverse shadow-xs'
                  : 'text-[--text-secondary] hover:text-[--text-primary]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                    isActive
                      ? 'bg-white/25 text-current'
                      : 'pill-neutral'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center gap-1 border-b', className)}
      style={{ borderColor: 'var(--border-primary)' }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-all cursor-pointer select-none',
              isActive
                ? 'border-[--text-primary] font-semibold'
                : 'border-transparent hover:text-[--text-primary]'
            )}
            style={{
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderColor: isActive ? 'var(--text-primary)' : 'transparent',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className="pill pill-neutral px-1.5 py-0.5 text-[10px]"
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
