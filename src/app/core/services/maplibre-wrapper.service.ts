import { Inject, Injectable } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { GeoJSONSource, type MapGeoJSONFeature, type MapLayerMouseEvent, NavigationControl, Popup } from 'maplibre-gl';
import type { FeatureCollection, Point } from 'geojson';
import { API_CONFIG, type ApiConfig } from '../config/app.config';
import { MAP_CONFIG } from '../config/map.config';
import type { VehicleFeatureProperties } from '../utils/geojson.utils';
import { VehicleType, type Vehicle } from '../models/vehicle.model';
const EMPTY_COLLECTION: FeatureCollection<Point, VehicleFeatureProperties> = {
  type: 'FeatureCollection',
  features: [],
};

@Injectable({ providedIn: 'root' })
export class MaplibreWrapperService {
  private readonly sourceId = MAP_CONFIG.layers.sources.vehicles;
  private map: maplibregl.Map | null = null;
  private popup: Popup | null = null;
  private onVehicleSelect: ((vehicleId: string) => void) | null = null;
  private currentData: FeatureCollection<Point, VehicleFeatureProperties> = EMPTY_COLLECTION;
  private selectedVehicle: Vehicle | null = null;
  private darkTheme = false;
  private isReady = false;

  constructor(@Inject(API_CONFIG) private readonly apiConfig: ApiConfig) { }

  initialize(container: HTMLElement, onVehicleSelect: (vehicleId: string) => void): void {
    this.destroy();
    this.onVehicleSelect = onVehicleSelect;
    maplibregl.setWorkerUrl(MAP_CONFIG.workerUrl);

    this.map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        glyphs: MAP_CONFIG.style.glyphsUrl,
        sources: {
          [MAP_CONFIG.layers.sources.osm]: {
            type: 'raster',
            tiles: [MAP_CONFIG.style.osmTileUrl],
            tileSize: 256,
            attribution: MAP_CONFIG.style.osmAttribution,
          },
        },
        layers: [
          {
            id: MAP_CONFIG.layers.ids.osm,
            type: 'raster',
            source: MAP_CONFIG.layers.sources.osm,
          },
        ],
      },
      center: [...this.apiConfig.mapCenter] as [number, number],
      zoom: this.apiConfig.defaultZoom,
      minZoom: this.apiConfig.minZoom,
      maxZoom: this.apiConfig.maxZoom,
    });

    this.map.addControl(new NavigationControl(), 'top-right');
    this.map.on('load', () => {
      this.isReady = true;
      this.configureSources();
      this.bindInteractions();
      this.applyCurrentData();
      this.applySelection();
      this.applyTheme();
    });
  }

  destroy(): void {
    this.popup?.remove();
    this.popup = null;
    this.isReady = false;
    this.map?.remove();
    this.map = null;
  }

  setVehicleData(data: FeatureCollection<Point, VehicleFeatureProperties>): void {
    this.currentData = data;
    this.applyCurrentData();
  }

  focusVehicle(vehicle: Vehicle | null, popupNode?: HTMLElement): void {
    this.selectedVehicle = vehicle;
    this.applySelection(popupNode);
  }

  setDarkTheme(enabled: boolean): void {
    this.darkTheme = enabled;
    this.applyTheme();
  }

  private configureSources(): void {
    if (!this.map || this.map.getSource(this.sourceId)) {
      return;
    }

    this.map.addSource(this.sourceId, {
      type: 'geojson',
      data: EMPTY_COLLECTION,
      cluster: MAP_CONFIG.source.cluster,
      clusterRadius: MAP_CONFIG.source.clusterRadius,
      clusterMaxZoom: MAP_CONFIG.source.clusterMaxZoom,
    });

    this.map.addLayer({
      id: MAP_CONFIG.layers.ids.clusters,
      type: 'circle',
      source: this.sourceId,
      filter: MAP_CONFIG.layers.filters.isCluster as any,
      paint: {
        'circle-color': ['step', ['get', 'point_count'], MAP_CONFIG.layers.colors.clusterSmall, 30, MAP_CONFIG.layers.colors.clusterMedium, 100, MAP_CONFIG.layers.colors.clusterLarge],
        'circle-radius': MAP_CONFIG.layers.paint.clusterRadius as any,
        'circle-stroke-width': MAP_CONFIG.layers.paint.clusterStrokeWidth,
        'circle-stroke-color': MAP_CONFIG.layers.colors.strokeDefault,
      },
    });

    this.map.addLayer({
      id: MAP_CONFIG.layers.ids.clusterCount,
      type: 'symbol',
      source: this.sourceId,
      filter: MAP_CONFIG.layers.filters.isCluster as any,
      layout: {
        'text-field': MAP_CONFIG.layers.layout.clusterTextField as any,
        'text-font': MAP_CONFIG.layers.layout.clusterTextFont as any,
        'text-size': MAP_CONFIG.layers.layout.clusterTextSize,
      },
      paint: {
        'text-color': MAP_CONFIG.layers.colors.clusterText,
      },
    });

    this.map.addLayer({
      id: MAP_CONFIG.layers.ids.vehicles,
      type: 'circle',
      source: this.sourceId,
      filter: MAP_CONFIG.layers.filters.isNotCluster as any,
      paint: {
        'circle-color': ['case', ['==', ['get', 'id'], ''], MAP_CONFIG.layers.colors.vehicleSelected, ['==', ['get', 'vehicle_type'], VehicleType.Scooter], MAP_CONFIG.layers.colors.vehicleScooter, MAP_CONFIG.layers.colors.vehicleDefault],
        'circle-radius': MAP_CONFIG.layers.paint.vehicleRadius as any,
        'circle-stroke-width': ['case', ['==', ['get', 'id'], ''], MAP_CONFIG.layers.paint.vehicleStrokeWidthSelected, MAP_CONFIG.layers.paint.vehicleStrokeWidthDefault],
        'circle-stroke-color': MAP_CONFIG.layers.colors.strokeDefault,
      },
    });
  }

  private bindInteractions(): void {
    if (!this.map) {
      return;
    }

    this.map.on('click', MAP_CONFIG.layers.ids.clusters, (event: MapLayerMouseEvent) => {
      const feature = this.map?.queryRenderedFeatures(event.point, { layers: [MAP_CONFIG.layers.ids.clusters] })[0];

      if (!feature || !this.map) {
        return;
      }

      const rawClusterId = feature.properties?.['cluster_id'];
      const clusterId = typeof rawClusterId === 'number' ? rawClusterId : Number(rawClusterId);
      const source = this.map.getSource(this.sourceId) as GeoJSONSource | undefined;

      if (source && Number.isFinite(clusterId)) {
        void source.getClusterExpansionZoom(clusterId).then((zoom) => {
          if (!this.map) {
            return;
          }

          const clusterCoordinates = (feature.geometry as Point).coordinates;
          this.map.easeTo({ center: clusterCoordinates as [number, number], zoom: zoom + MAP_CONFIG.interactions.clusterZoomOffset });
        });
      }
    });

    this.map.on('click', MAP_CONFIG.layers.ids.vehicles, (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0] as MapGeoJSONFeature | undefined;
      const vehicleId = feature?.properties?.['id'];

      if (typeof vehicleId === 'string') {
        this.onVehicleSelect?.(vehicleId);
      }
    });

    for (const layerId of [MAP_CONFIG.layers.ids.clusters, MAP_CONFIG.layers.ids.vehicles]) {
      this.map.on('mouseenter', layerId, () => {
        this.map?.getCanvas().style.setProperty('cursor', 'pointer');
      });

      this.map.on('mouseleave', layerId, () => {
        this.map?.getCanvas().style.removeProperty('cursor');
      });
    }
  }

  private applyCurrentData(): void {
    const source = this.map?.getSource(this.sourceId) as GeoJSONSource | undefined;
    source?.setData(this.currentData);
  }

  private applySelection(popupNode?: HTMLElement): void {
    if (!this.map || !this.isReady || !this.map.getLayer(MAP_CONFIG.layers.ids.vehicles)) {
      return;
    }

    const selectedVehicleId = this.selectedVehicle?.id ?? '__none__';

    this.map.setPaintProperty(MAP_CONFIG.layers.ids.vehicles, 'circle-color', [
      'case',
      ['==', ['get', 'id'], selectedVehicleId], MAP_CONFIG.layers.colors.vehicleSelected,
      ['==', ['get', 'vehicle_type'], VehicleType.Scooter], MAP_CONFIG.layers.colors.vehicleScooter,
      MAP_CONFIG.layers.colors.vehicleDefault,
    ]);

    this.map.setPaintProperty(MAP_CONFIG.layers.ids.vehicles, 'circle-radius', [
      'interpolate',
      ['linear'],
      ['zoom'],
      10, ['case', ['==', ['get', 'id'], selectedVehicleId], 7, 4],
      13, ['case', ['==', ['get', 'id'], selectedVehicleId], 11, 7],
      16, ['case', ['==', ['get', 'id'], selectedVehicleId], 18, 11],
    ]);

    this.map.setPaintProperty(MAP_CONFIG.layers.ids.vehicles, 'circle-stroke-width', [
      'case',
      ['==', ['get', 'id'], selectedVehicleId],
      MAP_CONFIG.layers.paint.vehicleStrokeWidthSelected,
      MAP_CONFIG.layers.paint.vehicleStrokeWidthDefault,
    ]);

    if (!this.selectedVehicle) {
      this.popup?.remove();
      this.popup = null;
      return;
    }

    this.map.flyTo({
      center: [this.selectedVehicle.location.longitude, this.selectedVehicle.location.latitude],
      zoom: MAP_CONFIG.interactions.vehicleFlyToZoom,
      essential: true,
      speed: MAP_CONFIG.interactions.vehicleFlyToSpeed,
      curve: MAP_CONFIG.interactions.vehicleFlyToCurve,
    });

    this.popup?.remove();
    const popup = new Popup({
      closeButton: true,
      closeOnClick: false,
      className: MAP_CONFIG.popup.className,
    })
      .setLngLat([this.selectedVehicle.location.longitude, this.selectedVehicle.location.latitude]);
      
    if (popupNode) {
      popup.setDOMContent(popupNode);
    }
    
    popup.addTo(this.map);
    this.popup = popup;
  }

  private applyTheme(): void {
    const canvas = this.map?.getCanvas();

    if (!canvas) {
      return;
    }

    canvas.style.filter = this.darkTheme
      ? MAP_CONFIG.theme.darkFilter
      : '';
  }

}