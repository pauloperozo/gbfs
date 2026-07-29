import type { GbfsResponse } from '../../app/core/models/gbfs.model';

export const mockGbfsResponse: GbfsResponse = {
  last_updated: 1700000000,
  ttl: 60,
  version: '1.1',
  data: {
    bikes: [
      {
        bike_id: '1',
        name: 'Bike 1',
        type: 'bike',
        lat: 10,
        lon: 20,
        is_reserved: 0,
        is_disabled: 0,
      }
    ]
  }
};
