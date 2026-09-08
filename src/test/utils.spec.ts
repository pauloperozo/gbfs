import { describe, it, expect } from 'vitest';
import { toVehicleFeatureCollection } from '../app/core/utils/geojson.utils';
import { VehicleType, type Vehicle } from '../app/core/models/vehicle.model';
import { MAP_CONFIG } from '../app/core/config/map.config';

describe('Utility Functions', () => {



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
