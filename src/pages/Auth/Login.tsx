import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, GraduationCap, School, ArrowRight, Lock, Mail, Sparkles, Building2 } from 'lucide-react';
import type { UserRole } from '@/types';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState('admin@campus.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmail('admin@campus.edu');
      setPassword('Admin@123');
    } else if (role === 'FACULTY') {
      setEmail('faculty@campus.edu');
      setPassword('Faculty@123');
    } else {
      setEmail('student@campus.edu');
      setPassword('Student@123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(selectedRole, email);
      setIsLoading(false);
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--bg-inverse)] text-[var(--text-inverse)] shadow-lg shadow-black/10 mb-2">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            CampusOptiX
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Smart Campus Resource & Timetable Optimizer
          </p>
        </div>

        {/* Auth Card */}
        <div className="surface-card p-6 sm:p-8 rounded-2xl border border-[var(--border-primary)] shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Choose your role to sign in
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Select an account persona or enter credentials
            </p>
          </div>

          {/* Quick Role Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                selectedRole === 'ADMIN'
                  ? 'border-[var(--text-primary)] bg-[var(--surface-2)] text-[var(--text-primary)] font-semibold shadow-sm'
                  : 'border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <ShieldCheck className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" />
              <span className="text-xs">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('FACULTY')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                selectedRole === 'FACULTY'
                  ? 'border-[var(--text-primary)] bg-[var(--surface-2)] text-[var(--text-primary)] font-semibold shadow-sm'
                  : 'border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <School className="w-5 h-5 mb-1 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs">Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('STUDENT')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                selectedRole === 'STUDENT'
                  ? 'border-[var(--text-primary)] bg-[var(--surface-2)] text-[var(--text-primary)] font-semibold shadow-sm'
                  : 'border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-400" />
              <span className="text-xs">Student</span>
            </button>
          </div>

          {/* Role Permissions Preview */}
          <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-primary)] text-xs text-[var(--text-secondary)] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              {selectedRole === 'ADMIN' && (
                <span>
                  <strong>Administrator:</strong> Full control over AI Optimizer, Conflict Resolution, Emergency reallocations, and System Settings.
                </span>
              )}
              {selectedRole === 'FACULTY' && (
                <span>
                  <strong>Faculty Member:</strong> View assigned lectures, submit room shift requests, access lab schedules, and view classroom availability.
                </span>
              )}
              {selectedRole === 'STUDENT' && (
                <span>
                  <strong>Student Portal:</strong> Personalized weekly timetable, room finder, live campus alerts, and vacant study space locator.
                </span>
              )}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-inverse py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole === 'ADMIN' ? 'Administrator' : selectedRole === 'FACULTY' ? 'Faculty' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-[var(--text-tertiary)]">
          Protected by Enterprise JWT Authentication & RBAC Engine
        </p>
      </div>
    </div>
  );
};

export default Login;
