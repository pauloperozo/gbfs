import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { catchError, map, of, type Observable } from 'rxjs';
import { API_CONFIG, type ApiConfig } from '../config/app.config';
import { parseGbfsBikeToVehicle } from '../utils/vehicle.parser';
import { GBFS_ERRORS } from '../constants/errors.constant';
import type { GbfsResponse } from '../models/gbfs.model';
import type { Vehicle, VehicleState } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class GbfsApiService {

  private readonly httpClient = inject(HttpClient);

  constructor(@Inject(API_CONFIG) private readonly apiConfig: ApiConfig) { }

  fetchVehiclesSnapshot(): Observable<VehicleState> {

    const endpoint = `${this.apiConfig.baseUrl}/${this.apiConfig.freeBikeStatusPath}`;

    return this.httpClient.get<GbfsResponse>(endpoint).pipe(
      map((response) => {
        const bikes = response.data.bikes;

        if (bikes.length === 0) {
          throw new Error(GBFS_ERRORS.API_EMPTY_VEHICLE_LIST);
        }

        return {
          vehicles: parseGbfsBikeToVehicle(bikes),
          error: null,
          receivedAt: new Date(response.last_updated),
        }

      }),
      catchError((error: Error) =>
        of({
          vehicles: [] as readonly Vehicle[],
          error: error.message || GBFS_ERRORS.API_CONNECTION_ERROR,
          receivedAt: new Date(),
        })
      ),
    );
  }
}
