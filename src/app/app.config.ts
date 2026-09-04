import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SocialAuthServiceConfig, GoogleLoginProvider, SocialLoginModule, SOCIAL_AUTH_CONFIG } from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { API_CONFIG, DEFAULT_API_CONFIG } from './core/config/app.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(SocialLoginModule),
    {
      provide: API_CONFIG,
      useValue: DEFAULT_API_CONFIG,
    },
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(DEFAULT_API_CONFIG.googleClientId)
          }
        ],
        onError: (err) => {
          console.error('Google Auth Error:', err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
