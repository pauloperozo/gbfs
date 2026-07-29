import { AfterViewInit, Component, ElementRef, OnDestroy, effect, inject, input, output, viewChild, createComponent, EnvironmentInjector, ApplicationRef, ComponentRef, EmbeddedViewRef } from '@angular/core';
import type { FeatureCollection, Point } from 'geojson';
import type { VehicleFeatureProperties } from '../../core/utils/geojson.utils';
import type { Vehicle } from '../../core/models/vehicle.model';
import { VehiclePopupComponent } from '../vehicle-popup/vehicle-popup.component';
import { MaplibreWrapperService } from '../../core/services/maplibre-wrapper.service';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrl: './map-container.component.css',
})
export class MapContainerComponent implements AfterViewInit, OnDestroy {
  readonly geoJsonData = input.required<FeatureCollection<Point, VehicleFeatureProperties>>();
  readonly selectedVehicle = input<Vehicle | null>(null);
  readonly darkTheme = input(false);
  readonly vehicleSelected = output<string>();
  private readonly mapHost = viewChild<ElementRef<HTMLDivElement>>('mapHost');
  private readonly maplibreWrapperService = inject(MaplibreWrapperService);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly applicationRef = inject(ApplicationRef);
  private popupRef: ComponentRef<VehiclePopupComponent> | null = null;

  private readonly syncDataEffect = effect(() => {
    this.maplibreWrapperService.setVehicleData(this.geoJsonData());
  });

  private readonly syncSelectionEffect = effect(() => {
    const vehicle = this.selectedVehicle();
    this.popupRef?.destroy();
    
    if (!vehicle) {
      this.maplibreWrapperService.focusVehicle(null);
      return;
    }
    
    this.popupRef = createComponent(VehiclePopupComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.popupRef.setInput('vehicle', vehicle);
    this.applicationRef.attachView(this.popupRef.hostView);
    
    const domElem = (this.popupRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.maplibreWrapperService.focusVehicle(vehicle, domElem);
  });

  private readonly syncThemeEffect = effect(() => {
    this.maplibreWrapperService.setDarkTheme(this.darkTheme());
  });

  ngAfterViewInit(): void {
    const host = this.mapHost();

    if (!host) {
      return;
    }

    this.maplibreWrapperService.initialize(host.nativeElement, (vehicleId) => {
      this.vehicleSelected.emit(vehicleId);
    });
  }

  ngOnDestroy(): void {
    this.popupRef?.destroy();
    this.maplibreWrapperService.destroy();
  }
}