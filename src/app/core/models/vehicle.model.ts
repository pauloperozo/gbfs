export enum VehicleType {
  Bike = 'bike',
  Scooter = 'scooter',
}

export interface Location {
  readonly latitude: number;
  readonly longitude: number;
}

export interface Vehicle {
  readonly id: string;
  readonly name: string;
  readonly type: VehicleType;
  readonly location: Location;
  readonly isReserved: boolean;
  readonly isDisabled: boolean;
}

export interface VehicleState {
  readonly vehicles: readonly Vehicle[];
  readonly error: string | null;
  readonly receivedAt: Date;
}

