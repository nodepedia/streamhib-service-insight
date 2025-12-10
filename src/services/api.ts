// API Service for InfinityStream Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth
  async login(identifier: string, password: string) {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // Users
  async getUsers(page = 1, limit = 20) {
    return this.request<{ users: User[]; pagination: Pagination }>(`/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // Streams
  async getStreams() {
    return this.request<Stream[]>('/streams');
  }

  async getStream(id: string) {
    return this.request<Stream>(`/streams/${id}`);
  }

  async createStream(data: CreateStreamData) {
    return this.request<Stream>('/streams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStream(id: string, data: Partial<Stream>) {
    return this.request<Stream>(`/streams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteStream(id: string) {
    return this.request(`/streams/${id}`, { method: 'DELETE' });
  }

  async startStream(id: string) {
    return this.request(`/streams/${id}/start`, { method: 'POST' });
  }

  async stopStream(id: string) {
    return this.request(`/streams/${id}/stop`, { method: 'POST' });
  }

  async getStreamStats(id: string) {
    return this.request(`/streams/${id}/stats`);
  }

  // Videos
  async getVideos() {
    return this.request<Video[]>('/videos');
  }

  async getVideo(id: string) {
    return this.request<Video>(`/videos/${id}`);
  }

  async uploadVideo(file: File, title: string, description?: string) {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    if (description) formData.append('description', description);

    const headers: HeadersInit = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    const response = await fetch(`${API_URL}/videos/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return response.json();
  }

  async updateVideo(id: string, data: { title?: string; description?: string }) {
    return this.request<Video>(`/videos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteVideo(id: string) {
    return this.request(`/videos/${id}`, { method: 'DELETE' });
  }

  async getVideoStorageStats() {
    return this.request<{ totalVideos: number; totalSize: number }>('/videos/stats/storage');
  }

  // Playlists
  async getPlaylists() {
    return this.request<Playlist[]>('/videos/playlists/all');
  }

  async getPlaylist(id: string) {
    return this.request<Playlist>(`/videos/playlists/${id}`);
  }

  async createPlaylist(name: string, description?: string) {
    return this.request<Playlist>('/videos/playlists', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async addVideoToPlaylist(playlistId: string, videoId: string) {
    return this.request(`/videos/playlists/${playlistId}/videos`, {
      method: 'POST',
      body: JSON.stringify({ videoId }),
    });
  }

  async removeVideoFromPlaylist(playlistId: string, videoId: string) {
    return this.request(`/videos/playlists/${playlistId}/videos/${videoId}`, {
      method: 'DELETE',
    });
  }

  async deletePlaylist(id: string) {
    return this.request(`/videos/playlists/${id}`, { method: 'DELETE' });
  }
}

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  created_at: string;
  updated_at?: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  filename: string;
  original_filename: string;
  file_size: number;
  duration_seconds?: number;
  mime_type: string;
  status: 'processing' | 'ready' | 'error';
  thumbnail_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  video_count?: number;
  videos?: Video[];
  created_at: string;
  updated_at?: string;
}

export interface Stream {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  source_url: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  stream_key: string;
  rtmp_url: string;
  status: 'idle' | 'starting' | 'live' | 'stopping' | 'error';
  quality: '720p' | '1080p' | '4k';
  is_24h: boolean;
  viewer_count: number;
  started_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateStreamData {
  name: string;
  description?: string;
  source_url: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  stream_key: string;
  rtmp_url?: string;
  quality?: '720p' | '1080p' | '4k';
  is_24h?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const api = new ApiService();
export default api;
