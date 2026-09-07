import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { mockNotifications } from '@/data/mockData';
import { timeAgo } from '@/utils/cn';
import { GlobalSearchModal } from '@/components/shared/GlobalSearchModal';
import { LogOut } from 'lucide-react';

interface TopBarProps {
  onToggleMobileMenu: () => void;
}

export const TopBar = ({ onToggleMobileMenu }: TopBarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-20 h-14 px-4 flex items-center justify-between gap-4 select-none"
        style={{
          backgroundColor: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        {/* Left: Mobile Toggle + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg focus-ring transition-colors btn-subtle"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="relative flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 focus-ring"
            style={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-tertiary)',
            }}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Search...</span>
            <kbd
              className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded-md"
              style={{
                backgroundColor: 'var(--surface-3)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-tertiary)',
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          {/* Live Status */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium"
            style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>62% Occupied</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg btn-subtle transition-colors focus-ring"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-lg btn-subtle transition-colors focus-ring"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"
                  style={{ boxShadow: '0 0 0 2px var(--surface-1)' }}
                />
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl shadow-lg z-50 overflow-hidden"
                style={{
                  backgroundColor: 'var(--surface-1)',
                  border: '1px solid var(--border-primary)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-primary)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Notifications
                    </span>
                    <span className="pill pill-info">{unreadNotifications.length} new</span>
                  </div>
                  <button
                    onClick={() => navigate('/notifications')}
                    className="text-[12px] font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    View all
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                  {mockNotifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (notif.actionRoute) navigate(notif.actionRoute);
                      }}
                      className="px-4 py-3 cursor-pointer transition-colors hover:bg-[--surface-2]"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-transparent'}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[12px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                              {timeAgo(notif.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border-primary)' }} />

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-xl transition-colors focus-ring hover:bg-[--surface-2] cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }}
              >
                {user?.avatar || 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[12px] font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {user?.name || 'User'}
                </span>
                <span className="text-[10px] leading-tight font-semibold capitalize text-blue-600 dark:text-blue-400">
                  {user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'FACULTY' ? 'Faculty' : 'Student'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 hidden sm:block" style={{ color: 'var(--text-tertiary)' }} />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl shadow-lg z-50 p-2"
                style={{
                  backgroundColor: 'var(--surface-1)',
                  border: '1px solid var(--border-primary)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }}
              >
                {/* Profile Header */}
                <div className="px-3 py-2.5 rounded-xl mb-1 bg-[var(--surface-2)]">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">{user?.name}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Role: {user?.role}
                  </span>
                </div>

                {/* Quick Switch Persona */}
                <div className="py-1">
                  <p className="section-label px-3 py-1.5">Switch Demo Persona</p>
                  {[
                    { role: 'ADMIN' as const, label: 'Administrator' },
                    { role: 'FACULTY' as const, label: 'Faculty Member' },
                    { role: 'STUDENT' as const, label: 'Student' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      onClick={() => { login(item.role); setShowProfileMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] transition-colors cursor-pointer ${user?.role === item.role ? 'font-semibold' : ''
                        }`}
                      style={{
                        backgroundColor: user?.role === item.role ? 'var(--surface-3)' : 'transparent',
                        color: user?.role === item.role ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <span>{item.label}</span>
                      {user?.role === item.role && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>

                <div className="mt-1 pt-1 border-t border-[var(--border-primary)] space-y-1">
                  <button
                    onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] transition-colors text-[var(--text-secondary)] hover:bg-[var(--surface-2)] cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out / Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Prominent Direct Logout Header Button */}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            title="Logout"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/40 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      <GlobalSearchModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default TopBar;
