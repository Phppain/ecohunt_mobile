import { getApiBaseUrl } from '@/constants/ecohunt';
import { AuthStorage } from './auth_storage';

export class AuthService {
  private baseUrl() {
    return getApiBaseUrl();
  }

  async login(email: string, password: string): Promise<any> {
    const res = await fetch(`${this.baseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data?.access_token) {
      await AuthStorage.save(data.access_token);
    }
    return data;
  }

  async register(nickname: string, email: string, password: string): Promise<any> {
    const res = await fetch(`${this.baseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, email, password }),
    });
    return res.json();
  }
}
