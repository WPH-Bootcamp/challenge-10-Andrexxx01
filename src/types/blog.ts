/**
 * Blog Types
 * 
 * TODO: Define types sesuai dengan response dari API
 * Contoh structure (sesuaikan dengan API response yang sebenarnya):
 */

// export interface BlogPost {
//   id: string;
//   title: string;
//   content: string;
//   author: string;
//   createdAt: string;
//   image?: string;
//   category?: string;
//   // ... tambahkan fields lainnya sesuai API
// }

// export interface BlogPostListResponse {
//   posts: BlogPost[];
//   total: number;
//   page: number;
//   // ... tambahkan fields lainnya
// }

/* ================= BLOG ================= */

export interface ArticleAuthor {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  author: ArticleAuthor;
}

export interface ArticleDetail {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  likes: number;
  comments: number;
  author: {
    id: number;
    name: string;
    username: string;
  };
}

/* ================= AUTH ================= */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

/* ================= USER ================= */

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  headline?: string;
  avatarUrl?: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  avatarUrl?: string | null;
}

/* ================= API ================= */

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

/* ================= Comment ================= */

export interface CommentAuthor {
  id: number;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: CommentAuthor;
}

