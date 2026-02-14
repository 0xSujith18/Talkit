export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string;
  role: 'citizen' | 'authority' | 'admin';
  isVerified?: boolean;
  avatar?: string;
}

export interface Post {
  _id: string;
  user: User;
  caption: string;
  media?: string[];
  location?: {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  category: 'complaint' | 'appreciation';
  hashtags?: string[];
  likes: string[];
  status: 'pending' | 'in_progress' | 'resolved';
  visibilityScore: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  user: User;
  text: string;
  isAuthorityResponse: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'like' | 'comment' | 'authority_response' | 'status_update';
  post?: Post;
  from?: User;
  message?: string;
  read: boolean;
  createdAt: string;
}
