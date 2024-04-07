import axios from "axios";
import GoogleMapsAPI from "../../GoogleMaps/GoogleMapsAPI";
import ToolType from "./ToolType";
import TorontoNeighbourhoods from '../../Utilities/TorontoNeighbourhoodsCrime.json';

/**
 * Checks if a given coordinate is inside a polygon defined by its vertices.
 * @param point The coordinate to check, represented as [latitude, longitude].
 * @param polygon An array of vertices representing the polygon, where each vertex is represented as [latitude, longitude].
 * @returns A boolean indicating whether the coordinate is inside the polygon.
 */
function isCoordinateInsidePolygon(point: [number, number], polygon: number[][]): boolean {
    let inside = false;
    const x = point[1];
    const y = point[0];

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0];
        const yi = polygon[i][1];
        const xj = polygon[j][0];
        const yj = polygon[j][1];

        const intersect =
            yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

/**
 * Retrieves the crime rate for a given address in Toronto.
 */
const ToolName = "get_crime_rate"
const TorontoNeighbourhoodCrimeRateTool: ToolType<{ neighbourhoodName: string, rate: string } | string> = {
    name: ToolName,

    modelParameters: {
        type: "function",
        function: {
            name: ToolName,
            description: "Get crime rate of a given location",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "An address, e.g. 1 Infinite Loop, Cupertino",
                    },
                },
                required: ["location"],
            },
        },
    },

    async run(args: string) {
        try {
            const parsedArguments = JSON.parse(args)

            if (parsedArguments.location === undefined) {
                throw new Error(`Invalid function arguments. args: ${JSON.stringify(parsedArguments)}`)
            }

            const address: string = parsedArguments.location

            // Use Google Geocoding API to get latitude and longitude for the provided address
            const geocodingResponse = await axios.get(
                GoogleMapsAPI.geocode(
                    address,
                    process.env.GOOGLE_MAPS_API_KEY ?? ""));

            const location = geocodingResponse.data.results[0].geometry.location

            if (location.lat === undefined || location.lng === undefined) {
                throw new Error(`Invalid location coordinates. location: ${location}`)
            }

            // Cached data from Toronto Police Open Data platform `https://data.torontopolice.on.ca/pages/open-data`. 
            // API available at `GET:https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=58b33705-45f0-4796-a1a7-5762cc152772`
            const filteredNeighbourhoods = TorontoNeighbourhoods.neighbourhoods.filter((neighbourhood) => {
                const coordinates = neighbourhood.geometry
                return isCoordinateInsidePolygon([location.lat, location.lng], coordinates)                
            })
            const neighbourhood = filteredNeighbourhoods.length > 0 ? filteredNeighbourhoods[0] : undefined

            if (neighbourhood !== undefined) {

                const totalCrimes = neighbourhood.ASSAULT_2023 + 
                neighbourhood.AUTOTHEFT_2023 + 
                (neighbourhood.BIKETHEFT_2023 ?? 0) +
                neighbourhood.BREAKENTER_2023 +
                (neighbourhood.HOMICIDE_2023 ?? 0) +
                (neighbourhood.ROBBERY_2023 ?? 0) +
                (neighbourhood.SHOOTING_2023 ?? 0) +
                neighbourhood.THEFTFROMMV_2023 +
                (neighbourhood.THEFTOVER_2023 ?? 0)

                const crimeRate = (totalCrimes / neighbourhood.POPULATION_2023) * 100000

                return { neighbourhoodName: neighbourhood.AREA_NAME, rate: crimeRate.toFixed(1) + " per 100,000" }
            } else {
                return "Unavailable"
            }
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            return Promise.resolve("Unavailable");
        }
    }
}
export default TorontoNeighbourhoodCrimeRateTool