import type { GbfsResponse } from '../../app/core/models/gbfs.model';
import { VehicleType } from '../../app/core/models/vehicle.model';

export const mockGbfsResponse: GbfsResponse = {
  success: true,
  message: "Vehículos obtenidos exitosamente",
  data: {
    vehicles: [
      {
        id: '1',
        name: 'Bike 1',
        type: VehicleType.Bike,
        location: {
          latitude: 10,
          longitude: 20
        },
        isReserved: false,
        isDisabled: false
      }
    ],
    total: 1,
    provider: "Lyft",
    lastUpdated: "2026-09-08T08:16:33.000Z",
    ttl: 60
  },
  timestamp: "2026-09-08T08:16:35.123Z"
};
