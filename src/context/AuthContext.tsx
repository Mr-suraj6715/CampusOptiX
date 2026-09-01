import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, UserRole } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, AuthUser> = {
  ADMIN: {
    id: 'usr_admin_01',
    name: 'Dr. Suraj Yadav',
    email: 'admin@campus.edu',
    role: 'ADMIN',
    department: 'Central Administration',
    avatar: 'SY',
  },
  FACULTY: {
    id: 'usr_fac_01',
    name: 'Prof. Rajesh Sharma',
    email: 'faculty@campus.edu',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    avatar: 'RS',
  },
  STUDENT: {
    id: 'usr_stu_01',
    name: 'Aryan Verma',
    email: 'student@campus.edu',
    role: 'STUDENT',
    department: 'B.Tech CSE - 3rd Year',
    avatar: 'AV',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('campusoptix_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to null so user enters login page
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusoptix_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusoptix_auth_user');
    }
  }, [user]);

  const login = (role: UserRole, email?: string, name?: string) => {
    const baseUser = DEMO_USERS[role];
    const loggedUser: AuthUser = {
      ...baseUser,
      email: email || baseUser.email,
      name: name || baseUser.name,
      role,
    };
    setUser(loggedUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusoptix_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
