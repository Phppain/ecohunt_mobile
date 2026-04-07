import { getApiBaseUrl } from '@/constants/ecohunt';

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

    return res.json();
  }

  async register(
    nickname: string,
    email: string,
    password: string,
  ): Promise<any> {
    const res = await fetch(`${this.baseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, email, password }),
    });

    return res.json();
  }
}

