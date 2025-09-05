import { User, Post, AuthState } from './types';

// Local Storage Keys
const STORAGE_KEYS = {
  AUTH_STATE: 'moms_kitchen_auth',
  POSTS: 'moms_kitchen_posts',
  USERS: 'moms_kitchen_users',
  CURRENT_USER: 'moms_kitchen_current_user'
} as const;

// Auth Management
export const authStorage = {
  getAuthState(): AuthState {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, user: null, loading: false };
    }
    
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    if (stored) {
      return JSON.parse(stored);
    }
    return { isAuthenticated: false, user: null, loading: false };
  },

  setAuthState(authState: AuthState): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState));
    }
  },

  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};

// User Management
export const userStorage = {
  getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },

  addUser(user: User): void {
    if (typeof window === 'undefined') return;
    
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find(user => user.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(user => user.email === email);
  },

  updateUser(id: string, updates: Partial<User>): void {
    if (typeof window === 'undefined') return;
    
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }
};

// Posts Management
export const postStorage = {
  getPosts(): Post[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    return stored ? JSON.parse(stored) : [];
  },

  addPost(post: Post): void {
    if (typeof window === 'undefined') return;
    
    const posts = this.getPosts();
    posts.unshift(post); // Add to beginning for newest first
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  getPostById(id: string): Post | undefined {
    return this.getPosts().find(post => post.id === id);
  },

  updatePost(id: string, updates: Partial<Post>): void {
    if (typeof window === 'undefined') return;
    
    const posts = this.getPosts();
    const index = posts.findIndex(post => post.id === id);
    
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }
  },

  deletePost(id: string): void {
    if (typeof window === 'undefined') return;
    
    const posts = this.getPosts().filter(post => post.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  getPostsByAuthor(authorId: string): Post[] {
    return this.getPosts().filter(post => post.authorId === authorId);
  }
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};