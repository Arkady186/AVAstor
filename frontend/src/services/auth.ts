import api from '../utils/api';
import { getTelegramInitData } from '../utils/telegram';

export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export async function authenticateWithTelegram(): Promise<AuthResponse> {
  const initData = getTelegramInitData();
  
  if (!initData) {
    throw new Error('Telegram initData not available');
  }

  const response = await api.post<AuthResponse>('/auth/telegram', {
    initData,
  });

  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<{ success: boolean; data: User }>('/auth/me');
  if (!response.data.success) {
    throw new Error('Failed to get current user');
  }
  return response.data.data;
}

