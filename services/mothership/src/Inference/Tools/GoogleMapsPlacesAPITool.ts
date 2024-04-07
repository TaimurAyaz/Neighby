import axios from "axios";
import GoogleMapsAPI from "../../GoogleMaps/GoogleMapsAPI";
import ToolType from "./ToolType";

/**
 * Object containing prohibited place types for certain categories.
 * Each key represents a category, and its corresponding value is an array of prohibited place types.
 */
const prohibitedPlaceTypes: { [key: string]: string[]; } = {
    "restaurant": ["lodging", "spa", "fast-food", "fast"],
    "hospital": ["clinic", "walk-in", "doctor", "store", "physiotherapist", "school"]
};

/**
 * Checks if a place is recommended based on its rating and number of user ratings.
 * @param place An object representing the place with properties `rating` and `user_ratings_total`.
 * @returns A boolean indicating whether the place is recommended.
 */
function isPlaceRecommended(place: { rating: number, user_ratings_total: number }): boolean {
    // Check if the place's rating is greater than or equal to 4.0
    // and if the total number of user ratings is greater than or equal to 20
    return place.rating >= 4.0 && place.user_ratings_total >= 20;
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns The distance between the two points in kilometers.
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6378; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1); // Difference in latitude converted to radians
    const dLon = toRadians(lon2 - lon1); // Difference in longitude converted to radians
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2); // Intermediate calculation for Haversine formula
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Intermediate calculation for Haversine formula
    const distance = R * c; // Distance in kilometers
    return distance;
}

/**
 * Converts degrees to radians.
 * @param degrees The angle in degrees to convert to radians.
 * @returns The angle in radians.
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Retrieves places near a specified location based on certain criteria.
 */
const ToolName = "get_places_nearby"
const GoogleMapsPlacesAPITool: ToolType<{ name: string, rating: number, distance: string }[]> = {
    name: ToolName,
    
    modelParameters: {
        type: "function",
        function: {
            name: ToolName,
            description: "Get places near a given location",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "An address, e.g. 1 Infinite Loop, Cupertino",
                    },
                    place: {
                        type: "string",
                        description: "A place. For example a Hospital or a Resturant or a Clinic etc.",
                    },
                    priority: { 
                        type: "string",
                        description: "The qualifier of query. e.g. nearest would equate to distance",
                        enum: ["ranking", "distance"] 
                    },
                },
                required: ["location", "place", "priority"],
            },
        },
    },

    async run(args: string) {
        try {
            const parsedArguments = JSON.parse(args)

            if (parsedArguments.location === undefined || parsedArguments.place === undefined) {
                throw new Error(`Invalid function arguments. args: ${JSON.stringify(parsedArguments)}`)
            }

            const address: string = parsedArguments.location
            const placeType: string = parsedArguments.place.toLowerCase()
            const priority: string = parsedArguments.priority ?? "ranking"

            // Use Google Geocoding API to get latitude and longitude for the provided address
            const geocodingResponse = await axios.get(
                GoogleMapsAPI.geocode(
                    address,
                    process.env.GOOGLE_MAPS_API_KEY ?? ""));

            const location = geocodingResponse.data.results[0].geometry.location;

            // Use Google Places API to find nearby places of placeType
            const placesResponse = await axios.get(
                    GoogleMapsAPI.placesNearbyWithKeyword(
                        placeType,
                        { latitude: location.lat, longitude: location.lng },
                        process.env.GOOGLE_MAPS_API_KEY ?? ""));

            const results = placesResponse.data.results

            const prohibited = prohibitedPlaceTypes[placeType] ?? []

            var placesDict: { [index: string]: { name: string, rating: number, distance: number } } = {}
            for (let index = 0; index < results.length; index++) {
                const result = results[index];

                if (result.business_status !== 'OPERATIONAL') {
                    continue
                }

                // Handle ranking based criteria e.g. recommended resturants
                if (priority === 'ranking' && isPlaceRecommended(result) == false) {
                    continue
                }

                if (result.types.includes(placeType) && result.types.doesNotInclude(prohibited)) {
                    placesDict[result.place_id] = {
                        name: result.name,
                        rating: result.rating,
                        distance: calculateDistance(location.lat, location.lng, result.geometry.location.lat, result.geometry.location.lng)
                    }
                }
            }

            var places: { name: string, rating: number, distance: number }[] = Object.values(placesDict)

            if (priority === 'distance') {
                places = places.sort((a, b) => a.distance - b.distance)
            }

            if (priority === 'ranking') {
                places = places.sort((a, b) => b.rating - a.rating)
            }            
            
            const limitedResults = places.slice(0, 6) // Let's limit the number of places to 6, in order to save on tokens sent to the LLM

            return limitedResults.map((p) => {
                return { name: p.name, rating: p.rating, distance: p.distance.toFixed(2) + " km" }
            });
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            return Promise.resolve([]);
        }
    }
}
export default GoogleMapsPlacesAPITool