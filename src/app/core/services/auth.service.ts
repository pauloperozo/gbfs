import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IS_BROWSER } from '../constants/platform.constants';

export interface User {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  // Reactive signals for state management
  readonly isAuthenticated = signal<boolean>(false);
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly authError = signal<string | null>(null);

  constructor() {
    // Check if user is already logged in (localStorage mock)
    if (IS_BROWSER) {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser) as User;
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        } catch {
          localStorage.removeItem('auth_user');
        }
      }
    }
  }

  loginWithEmail(username: string, password: string): Observable<User> {
    this.isLoading.set(true);
    this.authError.set(null);

    const loginData = { email: username, password };
    const loginUrl = 'https://gbs-backend-delta.vercel.app/auth/login';

    return this.http.post<{ access_token: string }>(loginUrl, loginData).pipe(
      tap({
        next: (response) => {
          this.isAuthenticated.set(true);
          
          const user: User = {
            email: username,
            name: username.split('@')[0],
          };
          
          this.currentUser.set(user);
          this.isLoading.set(false);

          if (IS_BROWSER) {
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.authError.set('Error de autenticación: Credenciales inválidas');
        }
      }),
      map(() => ({ email: username, name: username.split('@')[0] }))
    );
  }

  /**
   * Mock login with Google
   */
  loginWithGoogle(): Observable<User> {
    this.isLoading.set(true);
    this.authError.set(null);

    const mockUser: User = {
      email: 'usuario.google@gmail.com',
      name: 'Google User',
    };

    return of(mockUser).pipe(
      delay(1500), // simulate google redirect / login popup delay
      tap({
        next: (user) => {
          this.isAuthenticated.set(true);
          this.currentUser.set(user);
          this.isLoading.set(false);
          if (IS_BROWSER) {
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.authError.set('Error al conectar con Google');
        }
      })
    );
  }

  /**
   * Log out user
   */
  logout(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.authError.set(null);
    if (IS_BROWSER) {
      localStorage.removeItem('auth_user');
    }
    this.router.navigate(['/login']);
  }
}
