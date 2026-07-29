import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { VehicleFacade } from './core/store/vehicle.facade';
import { MapContainerComponent } from './features/map/map-container.component';
import { VehicleListComponent } from './features/vehicle-list/vehicle-list.component';
import { LoadingStateComponent } from './shared/loading-state/loading-state.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SearchBarComponent } from './shared/search-bar/search-bar.component';
import { API_CONFIG } from './core/config/app.config';
import { UI_CONFIG } from './core/config/ui.config';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    SearchBarComponent,
    LoadingStateComponent,
    VehicleListComponent,
    MapContainerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly facade = inject(VehicleFacade);
  protected readonly darkTheme = signal(false);
  protected readonly apiConfig = inject(API_CONFIG);
  protected readonly dictionary = UI_CONFIG.dictionary;
  protected readonly feedUrl = `${this.apiConfig.baseUrl}/${this.apiConfig.freeBikeStatusPath}`;
  private readonly storage = typeof localStorage === 'undefined' ? null : localStorage;
  private readonly themeConfig = UI_CONFIG.dictionary.theme;

  constructor() {
    const savedTheme = this.storage?.getItem(this.themeConfig.storageKey);
    this.darkTheme.set(savedTheme === this.themeConfig.darkValue);

    effect(() => {
      const themeName = this.darkTheme() ? this.themeConfig.darkValue : this.themeConfig.lightValue;
      document.documentElement.setAttribute(this.themeConfig.attributeName, themeName);
      this.storage?.setItem(this.themeConfig.storageKey, themeName);
    });

    this.facade.startPolling();
  }

  ngOnDestroy(): void {
    this.facade.stopPolling();
  }

  protected updateSearch(query: string): void {
    this.facade.setSearchQuery(query);
  }

  protected updateRefreshInterval(intervalMs: number): void {
    this.facade.setRefreshInterval(intervalMs);
  }

  protected selectVehicleFromList(vehicleId: string): void {
    this.facade.selectVehicleFromList(vehicleId);
  }

  protected selectVehicleFromMap(vehicleId: string): void {
    this.facade.selectVehicleFromMap(vehicleId);
  }

  protected toggleTheme(): void {
    this.darkTheme.update((currentValue) => !currentValue);
  }
}
