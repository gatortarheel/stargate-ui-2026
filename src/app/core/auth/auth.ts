import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { accessToken: string; expiresIn?: number; }

@Injectable({ providedIn: 'root' })
export class Auth {
  private accessToken = signal<string | null>(null);
  readonly isAuthenticated = computed(() => !!this.accessToken());

  constructor(private http: HttpClient, private router: Router) {
    // attempt restoring token from memory/storage if desired
    const token = sessionStorage.getItem('access_token');
    if (token) this.accessToken.set(token);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  async login(payload: LoginRequest): Promise<void> {
    const resp = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, payload).pipe(
        tap(r => {
          this.accessToken.set(r.accessToken);
          sessionStorage.setItem('access_token', r.accessToken);
        })
      )
    );
    this.router.navigateByUrl('/');
  }

  logout(redirect = '/auth/login'): void {
    this.accessToken.set(null);
    sessionStorage.removeItem('access_token');
    // optionally call backend logout endpoint here
    this.router.navigateByUrl(redirect);
  }
}
