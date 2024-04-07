/** Namespace containing functions for interacting with the Google Maps API. */
export namespace GoogleMapsAPI {
    /** Base URL for Google Maps API requests. */
    const baseUrl = "https://maps.googleapis.com/maps/api/"

    /**
     * Generates the URL for geocoding based on the provided address and API key.
     * @param address The address to geocode.
     * @param apiKey The API key for accessing the Google Maps API.
     * @returns The URL for geocoding the provided address.
     */
    export function geocode(address: string, apiKey: string) {
        return baseUrl + `geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    }

    /**
     * Generates the URL for searching nearby places with a keyword, based on the provided location and API key.
     * @param keyword The keyword to search for.
     * @param location The geographic location to search around.
     * @param apiKey The API key for accessing the Google Maps API.
     * @returns The URL for searching nearby places with the specified keyword.
     */
    export function placesNearbyWithKeyword(keyword: string, location: { latitude: number, longitude: number }, apiKey: string) {
        return baseUrl + `place/nearbysearch/json?location=${location.latitude},${location.longitude}&keyword=${keyword}&key=${apiKey}&rankby=distance`
    }
}
export default GoogleMapsAPI