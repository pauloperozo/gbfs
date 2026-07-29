export interface GbfsBikeDto {
    readonly bike_id: string;
    readonly type: string;
    readonly name: string;
    readonly lat: number;
    readonly lon: number;
    readonly is_reserved: number;
    readonly is_disabled: number;
}

export interface GbfsResponse {
    readonly data: {
        readonly bikes: readonly GbfsBikeDto[];
    };
    readonly last_updated: number;
    readonly ttl: number;
    readonly version: string;
}