import { Component, OnDestroy, inject } from '@angular/core';
import { VehicleFacade } from '../../core/store/vehicle.facade';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { LoadingStateComponent } from '../../shared/loading-state/loading-state.component';
import { VehicleListComponent } from '../vehicle-list/vehicle-list.component';
import { MapContainerComponent } from '../map/map-container.component';
import { API_CONFIG } from '../../core/config/app.config';
import { UI_CONFIG } from '../../core/config/ui.config';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    SearchBarComponent,
    LoadingStateComponent,
    VehicleListComponent,
    MapContainerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnDestroy {
  protected readonly facade = inject(VehicleFacade);
  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  protected readonly apiConfig = inject(API_CONFIG);
  protected readonly dictionary = UI_CONFIG.dictionary;
  protected readonly feedUrl = `${this.apiConfig.baseUrl}/${this.apiConfig.freeBikeStatusPath}`;

  constructor() {
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
    this.themeService.toggleTheme();
  }

  protected logout(): void {
    this.authService.logout();
  }
}
