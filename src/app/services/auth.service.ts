import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DataService } from './data.service';

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'LABOUR';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  siteId?: string | null;
  workerId?: string | null;
}

const TOKEN_KEY = 'thekedari_auth_token';
const USER_KEY = 'thekedari_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dataService = inject(DataService);

  private apiUrl = environment.apiUrl;

  public currentUser = signal<AuthUser | null>(this.loadStoredUser());
  public isAuthenticated = computed(() => !!this.currentUser());

  public needsSiteAssignment = computed(() => {
    const user = this.currentUser();
    return !!user && user.role !== 'ADMIN' && !user.siteId;
  });

  constructor() {
    const token = this.getToken();
    if (token) {
      if (!this.currentUser()) {
        this.restoreSession();
      } else {
        this.dataService.loadAllData();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  canAccessTab(tab: 'tab1' | 'tab2' | 'tab3' | 'tab4'): boolean {
    const user = this.currentUser();
    if (!user) return false;

    switch (user.role) {
      case 'ADMIN':
        return true;
      case 'SUPERVISOR':
        return true;
      case 'LABOUR':
        return tab === 'tab2';
      default:
        return false;
    }
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  isSupervisor(): boolean {
    return this.currentUser()?.role === 'SUPERVISOR';
  }

  isLabour(): boolean {
    return this.currentUser()?.role === 'LABOUR';
  }

  getDefaultRoute(): string {
    return this.isLabour() ? '/tabs/tab2' : '/tabs/tab1';
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.apiUrl}/auth/login`, {
      username,
      password,
    });
  }

  handleLoginSuccess(response: { token: string; user: AuthUser }) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.dataService.loadAllData();
    this.router.navigateByUrl(this.getDefaultRoute());
  }

  restoreSession() {
    const token = this.getToken();
    if (!token) return;

    this.http.get<AuthUser>(`${this.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        this.dataService.loadAllData();
      },
      error: () => this.logout(false),
    });
  }

  logout(navigate = true) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.dataService.clearData();
    if (navigate) {
      this.router.navigateByUrl('/login');
    }
  }

  listUsers() {
    return this.http.get<AuthUser[]>(`${this.apiUrl}/users`);
  }

  assignUserSite(userId: string, siteId: string, workerId?: string) {
    return this.http.patch<AuthUser>(`${this.apiUrl}/users/${userId}/assign-site`, {
      siteId,
      workerId,
    });
  }

  refreshProfile() {
    return this.http.get<AuthUser>(`${this.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        this.dataService.loadAllData();
      },
    });
  }

  private loadStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
