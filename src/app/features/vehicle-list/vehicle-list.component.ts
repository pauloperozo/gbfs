import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import type { Vehicle } from '../../core/models/vehicle.model';
import { UI_CONFIG } from '../../core/config/ui.config';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-vehicle-list',
  imports: [VehicleCardComponent],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css',
})
export class VehicleListComponent {
  readonly vehicles = input.required<readonly Vehicle[]>();
  readonly selectedVehicleId = input<string | null>(null);
  
  protected readonly dictionary = UI_CONFIG.dictionary;
  readonly vehicleSelected = output<string>();
  private readonly listHost = viewChild<ElementRef<HTMLElement>>('listHost');

  private readonly scrollSelectionIntoView = effect(() => {
    const selectedVehicleId = this.selectedVehicleId();
    const host = this.listHost();

    if (!selectedVehicleId || !host) {
      return;
    }

    queueMicrotask(() => {
      const cards = host.nativeElement.querySelectorAll<HTMLElement>('[data-vehicle-id]');
      const selectedCard = Array.from(cards).find((card) => card.getAttribute('data-vehicle-id') === selectedVehicleId);
      selectedCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}