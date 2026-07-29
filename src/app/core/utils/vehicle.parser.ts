import type { GbfsBikeDto } from '../../core/models/gbfs.model';
import { VehicleType, type Vehicle } from '../../core/models/vehicle.model';

export const parseGbfsBikeToVehicle = (bikes: readonly GbfsBikeDto[]): readonly Vehicle[] => {
    return bikes.map((bike) => ({
        id: bike.bike_id,
        name: bike.name,
        type: bike.type?.includes(VehicleType.Scooter) ? VehicleType.Scooter : VehicleType.Bike,
        location: {
            latitude: bike.lat,
            longitude: bike.lon,
        },
        isReserved: bike.is_reserved === 1,
        isDisabled: bike.is_disabled === 1,
    }));
};


