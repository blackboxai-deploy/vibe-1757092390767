export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
  location?: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  title: string;
  description: string;
  images: string[];
  recipe?: Recipe;
  categories: Category[];
  likes: string[]; // User IDs who liked
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  ingredients: string[];
  instructions: string[];
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface Comment {
  id: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface CreatePostData {
  title: string;
  description: string;
  images: File[];
  recipe?: Recipe;
  categories: string[];
}

export interface PostFilter {
  category?: string;
  author?: string;
  search?: string;
  sortBy?: 'recent' | 'popular' | 'trending';
}

export interface NotificationData {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  read: boolean;
  createdAt: string;
  relatedPostId?: string;
  relatedUserId?: string;
}