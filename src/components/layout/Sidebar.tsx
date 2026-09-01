import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  DoorOpen,
  FlaskConical,
  GraduationCap,
  Users,
  Calendar,
  AlertTriangle,
  Sparkles,
  Radio,
  BarChart3,
  Sliders,
  Bell,
  Settings as SettingsIcon,
  Flame,
  History,
  X,
  School,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'error' | 'warning' | 'info' | 'purple' | 'danger';
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Rooms & Halls', href: '/rooms', icon: DoorOpen },
  { title: 'Laboratories', href: '/labs', icon: FlaskConical },
  { title: 'Classes & Courses', href: '/classes', icon: GraduationCap },
  { title: 'Faculty Directory', href: '/faculty', icon: Users },
  { title: 'Master Timetable', href: '/timetable', icon: Calendar },
];

const optimizationNavItems: NavItem[] = [
  { title: 'Active Conflicts', href: '/conflicts', icon: AlertTriangle, badge: 3, badgeVariant: 'warning' },
  { title: 'AI Optimizer', href: '/optimizer', icon: Sparkles, badge: 'AI', badgeVariant: 'purple' },
  { title: 'Emergency Mode', href: '/emergency', icon: Flame, badge: 'Alert', badgeVariant: 'danger' },
  { title: 'Live Campus IoT', href: '/live-campus', icon: Radio },
  { title: 'Optimization History', href: '/history', icon: History },
  { title: 'Analytics & Audit', href: '/analytics', icon: BarChart3 },
  { title: 'What-If Simulator', href: '/simulation', icon: Sliders },
];

const systemNavItems: NavItem[] = [
  { title: 'Notifications', href: '/notifications', icon: Bell, badge: 4, badgeVariant: 'error' },
  { title: 'Settings', href: '/settings', icon: SettingsIcon },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) => {
  const location = useLocation();

  const renderNavGroup = (items: NavItem[], label?: string) => (
    <div className="space-y-0.5">
      {label && (
        <p className="section-label px-3 py-2 mt-2">
          {label}
        </p>
      )}
      {items.map((item) => {
        const isActive =
          location.pathname === item.href ||
          (item.href !== '/' && location.pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => onMobileClose && onMobileClose()}
            className={() =>
              cn(
                'group flex items-center justify-between px-3 py-2 text-[13px] font-medium rounded-xl transition-all duration-150 focus-ring',
                isActive
                  ? 'bg-[--bg-inverse] text-[--text-inverse] dark:bg-[--surface-3] dark:text-[--text-primary]'
                  : 'text-[--text-secondary] hover:bg-[--surface-2] hover:text-[--text-primary]'
              )
            }
          >
            <div className="flex items-center gap-2.5">
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  isActive
                    ? 'opacity-100'
                    : 'opacity-50 group-hover:opacity-80'
                )}
              />
              <span className="truncate">{item.title}</span>
            </div>

            {item.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                  isActive
                    ? 'bg-white/20 text-current'
                    : item.badgeVariant === 'error' || item.badgeVariant === 'danger'
                    ? 'pill-error'
                    : item.badgeVariant === 'warning'
                    ? 'pill-warning'
                    : 'pill-info'
                )}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-60 flex flex-col h-screen sticky top-0 shrink-0 select-none z-50 transition-transform duration-200',
          'bg-[--surface-1] border-r border-[--border-primary]',
          'lg:translate-x-0',
          mobileOpen ? 'fixed translate-x-0' : 'fixed -translate-x-full lg:static'
        )}
      >
        {/* Brand */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[--border-primary] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[--bg-inverse] dark:bg-[--surface-3] flex items-center justify-center text-[--text-inverse] dark:text-[--text-primary]">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-[13px] text-[--text-primary] tracking-tight leading-none">
                CampusOptiX
              </h1>
              <p className="text-[10px] text-[--text-tertiary] font-medium mt-0.5">
                Campus Optimizer
              </p>
            </div>
          </div>

          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="p-1.5 rounded-lg text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-2] lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
          {renderNavGroup(mainNavItems, 'Resources')}
          {renderNavGroup(optimizationNavItems, 'Optimizer')}
          {renderNavGroup(systemNavItems, 'System')}
        </div>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-[--border-primary] shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[--surface-2] cursor-pointer transition-colors">
            <div className="w-6 h-6 rounded-lg bg-[--surface-3] text-[--text-secondary] font-bold text-[10px] flex items-center justify-center">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[--text-primary] truncate">Admin</p>
              <p className="text-[10px] text-[--text-tertiary] truncate">admin@campus.edu</p>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
