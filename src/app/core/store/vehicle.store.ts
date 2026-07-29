import { Injectable, inject, signal } from '@angular/core';
import type { Vehicle } from '../models/vehicle.model';
import { API_CONFIG } from '../config/app.config';

@Injectable({ providedIn: 'root' })
export class VehicleStore {
  private readonly apiConfig = inject(API_CONFIG);

  readonly vehicles = signal<readonly Vehicle[]>([]);
  readonly selectedVehicleId = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly refreshIntervalMs = signal(this.apiConfig.pollingIntervals.find((i) => i.default)?.value ?? 15000);
  readonly lastUpdatedAt = signal<Date | null>(null);
}
