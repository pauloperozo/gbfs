import { Injectable, computed, inject } from '@angular/core';
import { VehicleStore } from './vehicle.store';
import { VehicleType } from '../models/vehicle.model';
import { toVehicleFeatureCollection } from '../utils/geojson.utils';
import { UI_CONFIG, type ConnectionTone } from '../config/ui.config';

@Injectable({ providedIn: 'root' })
export class VehicleSelectors {
  private readonly store = inject(VehicleStore);

  readonly filteredVehicles = computed(() => {
    const query = this.store.searchQuery().trim().toLowerCase();
    const vehicles = this.store.vehicles();

    if (!query) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => {
      const matchesName = vehicle.name.toLowerCase().includes(query);
      
      const typeLabel = vehicle.type === VehicleType.Scooter 
        ? UI_CONFIG.dictionary.vehicleType.scooter.toLowerCase() 
        : UI_CONFIG.dictionary.vehicleType.bike.toLowerCase();
        
      const matchesType = typeLabel.includes(query);

      return matchesName || matchesType;
    });
  });

  readonly selectedVehicle = computed(() => {
    const vehicleId = this.store.selectedVehicleId();
    if (!vehicleId) return null;
    const vehicles = this.store.vehicles();
    return vehicles.find((vehicle) => vehicle.id === vehicleId) ?? null;
  });

  readonly geoJsonData = computed(() => toVehicleFeatureCollection(this.filteredVehicles()));

  readonly connectionState = computed(() => {
    const loading = this.store.loading();
    const lastUpdatedAt = this.store.lastUpdatedAt();

    let tone: ConnectionTone = UI_CONFIG.connection.tones.live;
    let label: string = UI_CONFIG.connection.labels.live;

    if (loading) {
      tone = UI_CONFIG.connection.tones.loading;
      label = UI_CONFIG.connection.labels.loading;
    }

    let lastUpdateStr: string = UI_CONFIG.connection.labels.fallbackTime;
    if (lastUpdatedAt) {
      lastUpdateStr = lastUpdatedAt.toLocaleTimeString(UI_CONFIG.connection.locale, { hour12: false });
    }

    return {
      loading,
      tone,
      label,
      lastUpdate: lastUpdateStr,
    };
  });
}
