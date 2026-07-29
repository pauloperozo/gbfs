import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { VehicleStore } from './vehicle.store';
import { VehicleSelectors } from './vehicle.selectors';
import { GbfsApiService } from '../services/gbfs-api.service';
import { PollingService } from '../services/polling.service';
import type { VehicleState } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleEffects {
  private readonly store = inject(VehicleStore);
  private readonly selectors = inject(VehicleSelectors);
  private readonly gbfsApiService = inject(GbfsApiService);
  private readonly pollingService = inject(PollingService);
  private pollingSubscription: Subscription | null = null;

  startPolling(): void {
    this.stopPolling();
    this.store.loading.set(true);

    this.pollingSubscription = this.pollingService
      .create(this.store.refreshIntervalMs(), () => this.gbfsApiService.fetchVehiclesSnapshot())
      .subscribe((snapshot) => this.applySnapshot(snapshot));
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  applySnapshot(snapshot: VehicleState): void {
    this.store.vehicles.set(snapshot.vehicles);
    this.store.error.set(snapshot.error);
    this.store.lastUpdatedAt.set(snapshot.receivedAt);
    this.store.loading.set(false);
    this.ensureSelectionStillVisible();
  }

  ensureSelectionStillVisible(): void {
    const selectedVehicleId = this.store.selectedVehicleId();

    if (!selectedVehicleId) {
      return;
    }

    const filteredVehicles = this.selectors.filteredVehicles();
    const isSelectedVehicleVisible = filteredVehicles.some((vehicle) => vehicle.id === selectedVehicleId);

    if (!isSelectedVehicleVisible) {
      this.store.selectedVehicleId.set(null);
    }
  }
}
