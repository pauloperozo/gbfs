import { describe, it, expect } from 'vitest';
import { parseGbfsBikeToVehicle } from '../app/core/utils/vehicle.parser';
import { toVehicleFeatureCollection } from '../app/core/utils/geojson.utils';
import { VehicleType, type Vehicle } from '../app/core/models/vehicle.model';
import type { GbfsBikeDto } from '../app/core/models/gbfs.model';
import { MAP_CONFIG } from '../app/core/config/map.config';

describe('Utility Functions', () => {

  describe('parseGbfsBikeToVehicle', () => {
    
    it('should correctly parse a Scooter vehicle type', () => {
      const mockGbfsData: GbfsBikeDto[] = [{
        bike_id: 'scooter-123',
        name: 'Scooter Test',
        type: 'scooter',
        lat: 45.52,
        lon: -122.68,
        is_reserved: 0,
        is_disabled: 0
      }];

      const result = parseGbfsBikeToVehicle(mockGbfsData);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('scooter-123');
      expect(result[0].type).toBe(VehicleType.Scooter);
      expect(result[0].location.latitude).toBe(45.52);
    });

    it('should correctly parse a Bike vehicle type', () => {
      const mockGbfsData: GbfsBikeDto[] = [{
        bike_id: 'bike-456',
        name: 'Bike Test',
        type: 'bike',
        lat: 40.71,
        lon: -74.00,
        is_reserved: 1,
        is_disabled: 0
      }];

      const result = parseGbfsBikeToVehicle(mockGbfsData);

      expect(result[0].type).toBe(VehicleType.Bike);
      expect(result[0].isReserved).toBe(true);
      expect(result[0].isDisabled).toBe(false);
    });
  });

  describe('toVehicleFeatureCollection', () => {

    it('should correctly transform an array of vehicles into a GeoJSON FeatureCollection', () => {
      const mockVehicles: Vehicle[] = [{
        id: '1',
        name: 'V1',
        type: VehicleType.Scooter,
        location: { latitude: 10, longitude: 20 },
        isReserved: false,
        isDisabled: false
      }];

      const result = toVehicleFeatureCollection(mockVehicles);

      expect(result.type).toBe(MAP_CONFIG.geojson.types.featureCollection);
      expect(result.features).toHaveLength(1);
      expect(result.features[0].type).toBe(MAP_CONFIG.geojson.types.feature);
      expect(result.features[0].geometry.coordinates).toEqual([20, 10]); // GeoJSON es [lon, lat]
      expect(result.features[0].properties.id).toBe('1');
    });
    
  });
});
