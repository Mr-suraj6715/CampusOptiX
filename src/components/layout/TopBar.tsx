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
import { mockNotifications } from '@/data/mockData';
import { timeAgo } from '@/utils/cn';
import { GlobalSearchModal } from '@/components/shared/GlobalSearchModal';

interface TopBarProps {
  onToggleMobileMenu: () => void;
}

export const TopBar = ({ onToggleMobileMenu }: TopBarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Administrator' | 'Dean' | 'HOD' | 'Scheduler'>('Administrator');

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
              className="flex items-center gap-2 p-1.5 rounded-xl transition-colors focus-ring hover:bg-[--surface-2]"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }}
              >
                SY
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[12px] font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Suraj Yadav
                </span>
                <span className="text-[10px] leading-tight" style={{ color: 'var(--text-tertiary)' }}>
                  {currentRole}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 hidden sm:block" style={{ color: 'var(--text-tertiary)' }} />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl shadow-lg z-50 p-1.5"
                style={{
                  backgroundColor: 'var(--surface-1)',
                  border: '1px solid var(--border-primary)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }}
              >
                {/* Profile Header */}
                <div className="px-3 py-2.5 rounded-xl mb-1" style={{ backgroundColor: 'var(--surface-2)' }}>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Suraj Yadav</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>admin@campusoptix.edu</p>
                </div>

                {/* Role Switcher */}
                <div className="py-1">
                  <p className="section-label px-3 py-1.5">Role</p>
                  {(['Administrator', 'Dean', 'HOD', 'Scheduler'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => { setCurrentRole(role); setShowProfileMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
                        currentRole === role ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor: currentRole === role ? 'var(--surface-3)' : 'transparent',
                        color: currentRole === role ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <span>{role}</span>
                      {currentRole === role && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  ))}
                </div>

                <div className="mt-1 pt-1" style={{ borderTop: '1px solid var(--border-primary)' }}>
                  <button
                    onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] transition-colors btn-subtle"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
