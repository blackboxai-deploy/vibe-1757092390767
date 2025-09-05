'use client';

import { useState, useEffect } from 'react';
import { User, AuthState } from '@/lib/types';
import { authManager } from '@/lib/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState());

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe((newState: AuthState) => {
      setAuthState(newState);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return await authManager.login(email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    return await authManager.register(email, password, name);
  };

  const logout = async () => {
    await authManager.logout();
  };

  const updateUser = async (updates: Partial<User>) => {
    return await authManager.updateUser(updates);
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading: authState.loading
  };
};