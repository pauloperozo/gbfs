import { Injectable, effect, signal } from '@angular/core';
import { UI_CONFIG } from '../config/ui.config';
import { IS_BROWSER } from '../constants/platform.constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly darkTheme = signal(false);
  private readonly storage = IS_BROWSER ? localStorage : null;
  private readonly themeConfig = UI_CONFIG.dictionary.theme;

  constructor() {
    const savedTheme = this.storage?.getItem(this.themeConfig.storageKey);
    this.darkTheme.set(savedTheme === this.themeConfig.darkValue);

    effect(() => {
      const themeName = this.darkTheme() ? this.themeConfig.darkValue : this.themeConfig.lightValue;
      if (IS_BROWSER) {
        document.documentElement.setAttribute(this.themeConfig.attributeName, themeName);
      }
      this.storage?.setItem(this.themeConfig.storageKey, themeName);
    });
  }

  toggleTheme(): void {
    this.darkTheme.update((currentValue) => !currentValue);
  }
}
