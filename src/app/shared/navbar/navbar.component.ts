import { Component, inject, input, output } from '@angular/core';
import { UI_CONFIG, type ConnectionTone } from '../../core/config/ui.config';
import { API_CONFIG } from '../../core/config/app.config';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly connectionLabel = input<string>(UI_CONFIG.connection.labels.live);
  readonly connectionTone = input<ConnectionTone>(UI_CONFIG.connection.tones.live);
  readonly vehicleCount = input(0);
  readonly refreshIntervalMs = input(15000);
  readonly darkTheme = input(false);
  
  protected readonly dictionary = UI_CONFIG.dictionary;
  protected readonly connectionTones = UI_CONFIG.connection.tones;
  protected readonly intervals = inject(API_CONFIG).pollingIntervals;

  readonly refreshIntervalChange = output<number>();
  readonly themeToggle = output<void>();

  protected updateRefreshInterval(value: string): void {
    this.refreshIntervalChange.emit(Number(value));
  }
}