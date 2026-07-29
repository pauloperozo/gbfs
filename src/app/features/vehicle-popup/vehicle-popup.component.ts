import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { VehicleType, type Vehicle } from '../../core/models/vehicle.model';
import { UI_CONFIG } from '../../core/config/ui.config';

@Component({
  selector: 'app-vehicle-popup',
  imports: [DecimalPipe],
  templateUrl: './vehicle-popup.component.html',
  styleUrl: './vehicle-popup.component.css',
})
export class VehiclePopupComponent {
  readonly vehicle = input.required<Vehicle>();
  protected readonly vehicleType = VehicleType;
  protected readonly dictionary = UI_CONFIG.dictionary;

  protected readonly typeLabel = computed(() => {
    return this.vehicle().type === VehicleType.Scooter ? this.dictionary.vehicleType.scooter : this.dictionary.vehicleType.bike;
  });

  protected readonly status = computed(() => {
    const v = this.vehicle();
    return v.isDisabled ? this.dictionary.status.maintenance : v.isReserved ? this.dictionary.status.reserved : this.dictionary.status.available;
  });

  protected readonly badgeClass = computed(() => {
    const v = this.vehicle();
    return v.isDisabled ? 'badge-disabled' : v.isReserved ? 'badge-reserved' : 'badge-available';
  });
}
