import {catchErrors} from "../errors/catchErrors";
import {calcDistance, limitToOnline, sortNearby, sortNew, sortPopular, validateParameters} from "../utils";
import CustomError from "../errors/CustomError";
import {Restaurant} from "../types";

let { restaurants } = require('../../restaurants.json');
export const discovery = catchErrors(async (req, res) => {

    const { lat, lon } = req.query;

    // if there are multiple occurrences of lat or lon request parameters
    // the variables will be string[] instead of string, this also catches
    // missing parameters

    if (typeof lat !== 'string' || typeof lon !== 'string')
        throw new CustomError(
            'Invalid parameter: duplicate or missing parameters',
            400,
            'Request contained invalid parameters',
        );

    validateParameters(lat, lon);

    // copy restaurants closer than 1.5km to a new array
    const filterNearby: Restaurant[] = [];

    restaurants.forEach((restaurant: any) => {
        let dist = calcDistance(
                restaurant.location[0],
                restaurant.location[1],
                Number(lat),
                Number(lon)
            );

        // I add a distance property to the restaurant list, this is to avoid
        // having to calculate distance several times in the sortNearby function
        // not sure if this is more effective, I omit it in limitToOnline()

        if (dist < 1.5)
            filterNearby.push({...restaurant, distance: dist});
    }
    );

    const popularRestaurants = limitToOnline(sortPopular(filterNearby));
    const newRestaurants = limitToOnline(sortNew(filterNearby));
    const nearbyRestaurants = limitToOnline(sortNearby(filterNearby));

    res.json({
        sections: [
            {
                title: 'Popular Restaurants',
                restaurants: popularRestaurants
            },
            {
                title: 'New Restaurants',
                restaurants: newRestaurants
            },
            {
                title: 'Nearby Restaurants',
                restaurants: nearbyRestaurants
            }
            ]
    });
}, 'Failed to get discovery');