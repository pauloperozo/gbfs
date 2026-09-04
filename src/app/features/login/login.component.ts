import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { UI_CONFIG } from '../../core/config/ui.config';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly dictionary = UI_CONFIG.dictionary;
  private readonly router = inject(Router);
  private readonly socialAuthService = inject(SocialAuthService);
  private authSubscription!: Subscription;

  // Password visibility toggle
  protected readonly showPassword = signal(false);

  // Form group definition
  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.loginWithGoogleToken(user.idToken);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid || this.authService.isLoading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    
    this.authService.loginWithEmail(email, password).subscribe({
      next: () => {
        this.router.navigate(['/map']);
      },
      error: (err: Error) => {
        console.error('Error de inicio de sesión:', err);
      },
    });
  }

  private loginWithGoogleToken(idToken: string): void {
    if (this.authService.isLoading()) {
      return;
    }

    this.authService.loginWithGoogle(idToken).subscribe({
      next: () => {
        this.router.navigate(['/map']);
      },
      error: (err: Error) => {
        console.error('Error con Google login:', err);
      },
    });
  }
}
