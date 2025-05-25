// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'cyber_token';

  constructor(private http: HttpClient, private router: Router) {}

  // Save token
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token
  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if token is valid (JWT)
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!this.getToken() && this.isTokenValid();
  }

  // Redirect if not logged in
  enforceLogin() {
    if (!this.isLoggedIn()) {
      this.clearToken();
      this.router.navigate(['/login']);
    }
  }

  // Get user info from backend
  getUserInfo() {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${environment.apiUrl}/api/user`, { headers });
  }
}
