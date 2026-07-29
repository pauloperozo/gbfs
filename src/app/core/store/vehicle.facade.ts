import { Injectable, inject } from '@angular/core';
import { VehicleStore } from './vehicle.store';
import { VehicleSelectors } from './vehicle.selectors';
import { VehicleEffects } from './vehicle.effects';

@Injectable({ providedIn: 'root' })
export class VehicleFacade {
  private readonly store = inject(VehicleStore);
  private readonly selectors = inject(VehicleSelectors);
  private readonly effects = inject(VehicleEffects);

  readonly vehicles = this.store.vehicles;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly searchQuery = this.store.searchQuery;
  readonly refreshIntervalMs = this.store.refreshIntervalMs;
  readonly selectedVehicleId = this.store.selectedVehicleId;
  
  readonly filteredVehicles = this.selectors.filteredVehicles;
  readonly selectedVehicle = this.selectors.selectedVehicle;
  readonly geoJsonData = this.selectors.geoJsonData;
  readonly connectionState = this.selectors.connectionState;

  startPolling(): void {
    this.effects.startPolling();
  }

  stopPolling(): void {
    this.effects.stopPolling();
  }

  setSearchQuery(query: string): void {
    this.store.searchQuery.set(query);
    this.effects.ensureSelectionStillVisible();
  }

  setRefreshInterval(intervalMs: number): void {
    if (intervalMs === this.store.refreshIntervalMs()) {
      return;
    }

    this.store.refreshIntervalMs.set(intervalMs);
    this.effects.startPolling();
  }

  selectVehicleFromList(vehicleId: string): void {
    this.store.selectedVehicleId.set(vehicleId);
  }

  selectVehicleFromMap(vehicleId: string): void {
    this.store.selectedVehicleId.update((selectedVehicleId) => {
      if (selectedVehicleId === vehicleId) {
        return null;
      }

      return vehicleId;
    });
  }
}
