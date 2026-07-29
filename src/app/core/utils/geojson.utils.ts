import type { Feature, FeatureCollection, Point } from 'geojson';
import { VehicleType, type Vehicle } from '../../core/models/vehicle.model';
import { MAP_CONFIG } from '../config/map.config';

export interface VehicleFeatureProperties {
  readonly id: string;
  readonly vehicle_type: VehicleType;
}

export function toVehicleFeatureCollection(
  vehicles: readonly Vehicle[],
): FeatureCollection<Point, VehicleFeatureProperties> {
  return {
    type: MAP_CONFIG.geojson.types.featureCollection,
    features: vehicles.map((vehicle) => toVehicleFeature(vehicle)),
  };
}

function toVehicleFeature(vehicle: Vehicle): Feature<Point, VehicleFeatureProperties> {
  return {
    type: MAP_CONFIG.geojson.types.feature,
    geometry: {
      type: MAP_CONFIG.geojson.types.point,
      coordinates: [vehicle.location.longitude, vehicle.location.latitude],
    },
    properties: {
      id: vehicle.id,
      vehicle_type: vehicle.type,
    },
  };
}
