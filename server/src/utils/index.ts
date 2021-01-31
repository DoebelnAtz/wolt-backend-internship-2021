import CustomError from "../errors/CustomError";
import {Restaurant} from "../types";

const toRadians = (deg: number) => {
    return deg * (Math.PI/180)
};

// calculate distance between two coordinated using the haversine formula

export const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {

    let R = 6371; // Radius of the earth in km

    let dLat = toRadians(lat2 - lat1);
    let dLon = toRadians(lon2 - lon1);

    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return (d);
};

export const validateParameters = (lat: string, lon: string) => {
    if (isNaN(Number(lat)) || isNaN(Number(lon))) {
        throw new CustomError(
            'Invalid parameter: NaN',
            400,
            'Parameter was not a valid number'
            )
    }
    else if (Number(lat) > 90 || Number(lat) < -90) {
        throw new CustomError(
            'Invalid latitude: Exceeds limit',
            400,
            'Latitude parameter exceeded the range of latitude'
        )
    }
    else if (Number(lon) > 180 || Number(lon) < -180) {
        throw new CustomError(
            'Invalid longitude: Exceeds limit',
            400,
            'Longitude parameter exceeded the range of longitude'
        )
    }
    return true
};

export const sortPopular = (restaurants: Restaurant[]) =>
    restaurants
        .sort(
            (a: Restaurant, b: Restaurant) =>
                a.popularity > b.popularity ? -1
                    : a.popularity < b.popularity ? 1
                    : 0 );

export const sortNew = (restaurants: Restaurant[]) => {

    let limit = new Date();
    limit.setMonth(limit.getMonth() - 1);

    return restaurants
        .sort(
            (a: Restaurant, b: Restaurant) =>
                new Date(a.launch_date) > new Date(b.launch_date) ? -1
                    : new Date(a.launch_date) < new Date(b.launch_date) ? 1
                    : 0)
        .filter((r: Restaurant) => new Date(r.launch_date) > limit);
};

export const sortNearby = (restaurants: Restaurant[]) =>
    restaurants
        .sort(
            (a: Restaurant, b: Restaurant) =>
                // @ts-ignore
                a.distance > b.distance ? 1
                    // @ts-ignore
                    : a.distance < b.distance ? -1
                    : 0 );

export const limitToOnline = (restaurants: Restaurant[]) =>
    restaurants
        .sort(
            (a: Restaurant, b: Restaurant) =>
                a.online && !b.online ? -1
                    : !a.online && b.online ? 1
                    : 0 )
        .slice(0, 10)
        // we omit the distance key
        .map(r => (({ distance, ...rest }) => rest)(r));