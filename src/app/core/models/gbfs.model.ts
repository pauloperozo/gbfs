import { Vehicle } from './vehicle.model';

export interface GbfsResponse {
    readonly success: boolean;
    readonly message: string;
    readonly data: {
        readonly vehicles: readonly Vehicle[];
        readonly total: number;
        readonly provider: string;
        readonly lastUpdated: string;
        readonly ttl: number;
    };
    readonly timestamp: string;
}