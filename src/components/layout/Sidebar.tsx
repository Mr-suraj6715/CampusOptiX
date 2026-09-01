import React from 'react';
import { NavLink } from 'react-router-dom';
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
  LogOut,
  Shield,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'error' | 'warning' | 'info' | 'purple' | 'danger';
  roles: UserRole[];
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
  { title: 'Rooms & Halls', href: '/rooms', icon: DoorOpen, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
  { title: 'Laboratories', href: '/labs', icon: FlaskConical, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
  { title: 'Classes & Courses', href: '/classes', icon: GraduationCap, roles: ['ADMIN', 'FACULTY'] },
  { title: 'Faculty Directory', href: '/faculty', icon: Users, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
  { title: 'Master Timetable', href: '/timetable', icon: Calendar, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
];

const optimizationNavItems: NavItem[] = [
  { title: 'Active Conflicts', href: '/conflicts', icon: AlertTriangle, badge: 3, badgeVariant: 'warning', roles: ['ADMIN'] },
  { title: 'AI Optimizer', href: '/optimizer', icon: Sparkles, badge: 'AI', badgeVariant: 'purple', roles: ['ADMIN'] },
  { title: 'Emergency Mode', href: '/emergency', icon: Flame, badge: 'Alert', badgeVariant: 'danger', roles: ['ADMIN', 'FACULTY'] },
  { title: 'Live Campus IoT', href: '/live-campus', icon: Radio, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
  { title: 'Optimization History', href: '/history', icon: History, roles: ['ADMIN'] },
  { title: 'Analytics & Audit', href: '/analytics', icon: BarChart3, roles: ['ADMIN'] },
  { title: 'What-If Simulator', href: '/simulation', icon: Sliders, roles: ['ADMIN'] },
];

const systemNavItems: NavItem[] = [
  { title: 'Notifications', href: '/notifications', icon: Bell, badge: 4, badgeVariant: 'error', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
  { title: 'Settings', href: '/settings', icon: SettingsIcon, roles: ['ADMIN'] },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'STUDENT';

  const renderBadge = (item: NavItem) => {
    if (!item.badge) return null;
    const variantClass = {
      error: 'pill-error',
      warning: 'pill-warning',
      info: 'pill-info',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      danger: 'pill-error',
    }[item.badgeVariant || 'info'];

    return (
      <span className={cn('pill text-[10px] font-semibold px-1.5 py-0', variantClass)}>
        {item.badge}
      </span>
    );
  };

  const renderNavGroup = (items: NavItem[], label: string) => {
    const visibleItems = items.filter((item) => item.roles.includes(userRole));
    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-1">
        <p className="section-label px-3 py-1">{label}</p>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[var(--bg-inverse)] text-[var(--text-inverse)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        'w-4 h-4 flex-shrink-0 transition-colors',
                        isActive
                          ? 'text-[var(--text-inverse)]'
                          : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {renderBadge(item)}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-60 flex flex-col h-screen sticky top-0 shrink-0 select-none z-50 transition-transform duration-200',
          'bg-[var(--surface-1)] border-r border-[var(--border-primary)]',
          'lg:translate-x-0',
          mobileOpen ? 'fixed translate-x-0' : 'fixed -translate-x-full lg:static'
        )}
      >
        {/* Brand */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border-primary)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-inverse)] dark:bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-inverse)] dark:text-[var(--text-primary)]">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-[13px] text-[var(--text-primary)] tracking-tight leading-none">
                CampusOptiX
              </h1>
              <p className="text-[10px] text-[var(--text-tertiary)] font-medium mt-0.5">
                Campus Optimizer
              </p>
            </div>
          </div>

          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] lg:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
          {renderNavGroup(mainNavItems, 'Resources')}
          {renderNavGroup(optimizationNavItems, 'Optimizer & AI')}
          {renderNavGroup(systemNavItems, 'System')}
        </div>

        {/* Footer with User info & Logout */}
        <div className="p-2 border-t border-[var(--border-primary)] shrink-0 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border-primary)]">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-inverse)] text-[var(--text-inverse)] font-bold text-[11px] flex items-center justify-center">
              {user?.avatar || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">
                {user?.name || 'User'}
              </p>
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-blue-500" />
                <p className="text-[10px] text-[var(--text-tertiary)] font-medium capitalize">
                  {user?.role?.toLowerCase() || 'Student'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[var(--text-tertiary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
