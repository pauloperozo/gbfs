import { InjectionToken } from '@angular/core';

export interface ApiConfig {
    readonly baseUrl: string;
    readonly freeBikeStatusPath: string;
    readonly pollingIntervals: readonly { value: number; label: string; default?: boolean }[];
    readonly providerName: string;
    readonly mapCenter: readonly [number, number];
    readonly defaultZoom: number;
    readonly minZoom: number;
    readonly maxZoom: number;
    readonly googleClientId: string;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
    baseUrl: 'https://gbfs.lyft.com/gbfs/1.1/pdx/en',
    freeBikeStatusPath: 'free_bike_status.json',
    pollingIntervals: [
        { value: 1000, label: '1s' },
        { value: 5000, label: '5s' },
        { value: 10000, label: '10s' },
        { value: 20000, label: '20s' },
        { value: 30000, label: '30s', default: true },
        { value: 40000, label: '40s' },
        { value: 50000, label: '50s' },
        { value: 60000, label: '60s' },
    ],
    providerName: 'Lyft',
    mapCenter: [-122.6765, 45.5231],
    defaultZoom: 13,
    minZoom: 10,
    maxZoom: 18,
    googleClientId: '383969365968-vjvbjuknr42iv6bnus4kp2g0v091vljf.apps.googleusercontent.com',
};

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');