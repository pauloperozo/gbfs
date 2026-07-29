import { Component, input, output } from '@angular/core';
import { VehicleType, type Vehicle } from '../../core/models/vehicle.model';
import { UI_CONFIG } from '../../core/config/ui.config';

@Component({
  selector: 'app-vehicle-card',
  imports: [],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.css',
})
export class VehicleCardComponent {
  readonly vehicle = input.required<Vehicle>();
  readonly selected = input(false);
  readonly vehicleSelected = output<string>();
  protected readonly vehicleType = VehicleType;
  protected readonly dictionary = UI_CONFIG.dictionary;
}