import { Component, inject, input } from '@angular/core';
import { VehicleType, type Vehicle } from '../../core/models/vehicle.model';
import { UI_CONFIG } from '../../core/config/ui.config';
import { API_CONFIG } from '../../core/config/app.config';

@Component({
  selector: 'app-vehicle-detail-panel',
  imports: [],
  templateUrl: './vehicle-detail-panel.component.html',
  styleUrl: './vehicle-detail-panel.component.css',
})
export class VehicleDetailPanelComponent {
  readonly vehicle = input<Vehicle | null>(null);
  protected readonly vehicleType = VehicleType;
  protected readonly dictionary = UI_CONFIG.dictionary;
  protected readonly providerName = inject(API_CONFIG).providerName;
}