'use client';

import { User, AuthState } from './types';
import { authStorage, userStorage, generateId } from './storage';

export class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = { isAuthenticated: false, user: null, loading: false };
  private listeners: ((state: AuthState) => void)[] = [];

  private constructor() {
    // Initialize from storage
    if (typeof window !== 'undefined') {
      this.authState = authStorage.getAuthState();
    }
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // Subscribe to auth state changes
  subscribe(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState));
  }

  // Get current auth state
  getAuthState(): AuthState {
    return this.authState;
  }

  // Register new user
  async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      this.authState.loading = true;
      this.notifyListeners();

      // Check if user already exists
      const existingUser = userStorage.getUserByEmail(email);
      if (existingUser) {
        this.authState.loading = false;
        this.notifyListeners();
        return { success: false, error: 'User already exists with this email' };
      }

      // Create new user
      const newUser: User = {
        id: generateId(),
        email,
        name,
        avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ffcac749-62e7-4ff1-a748-1d873bc44158.png}`,
        bio: '',
        joinedDate: new Date().toISOString(),
        location: ''
      };

      // Store user
      userStorage.addUser(newUser);

      // Update auth state
      this.authState = {
        isAuthenticated: true,
        user: newUser,
        loading: false
      };

      // Persist auth state
      authStorage.setAuthState(this.authState);
      this.notifyListeners();

      return { success: true, user: newUser };
    } catch (error) {
      this.authState.loading = false;
      this.notifyListeners();
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      this.authState.loading = true;
      this.notifyListeners();

      // Find user
      const user = userStorage.getUserByEmail(email);
      if (!user) {
        this.authState.loading = false;
        this.notifyListeners();
        return { success: false, error: 'No account found with this email' };
      }

      // In a real app, you'd verify password here
      // For demo purposes, we'll accept any password

      // Update auth state
      this.authState = {
        isAuthenticated: true,
        user,
        loading: false
      };

      // Persist auth state
      authStorage.setAuthState(this.authState);
      this.notifyListeners();

      return { success: true, user };
    } catch (error) {
      this.authState.loading = false;
      this.notifyListeners();
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    this.authState = {
      isAuthenticated: false,
      user: null,
      loading: false
    };

    authStorage.clearAuth();
    this.notifyListeners();
  }

  // Update current user
  async updateUser(updates: Partial<User>): Promise<{ success: boolean; error?: string; user?: User }> {
    if (!this.authState.user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const updatedUser = { ...this.authState.user, ...updates };
      
      // Update in storage
      userStorage.updateUser(this.authState.user.id, updates);

      // Update auth state
      this.authState.user = updatedUser;
      authStorage.setAuthState(this.authState);
      this.notifyListeners();

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && this.authState.user !== null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.authState.user;
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance();