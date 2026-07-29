import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { GbfsApiService } from '../app/core/services/gbfs-api.service';
import { API_CONFIG, DEFAULT_API_CONFIG } from '../app/core/config/app.config';
import { mockGbfsResponse } from './mocks/gbfs.mock';

describe('GbfsApiService', () => {
  let service: GbfsApiService;
  let httpMock: HttpTestingController;

  const mockApiConfig = DEFAULT_API_CONFIG;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        GbfsApiService,
        { provide: API_CONFIG, useValue: mockApiConfig }
      ]
    });

    service = TestBed.inject(GbfsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should map a successful response to a valid VehicleState', () => {
    const mockResponse = mockGbfsResponse;

    service.fetchVehiclesSnapshot().subscribe(state => {
      expect(state.error).toBeNull();
      expect(state.vehicles).toHaveLength(1);
      expect(state.vehicles[0].id).toBe('1');
    });

    const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/${mockApiConfig.freeBikeStatusPath}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should return a controlled error state if the server fails', () => {
    service.fetchVehiclesSnapshot().subscribe(state => {
      expect(state.error).toContain('Http failure response');
      expect(state.vehicles).toEqual([]);
    });

    const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/${mockApiConfig.freeBikeStatusPath}`);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
  });
});
