import request from "./request";

export default class BreweryService {
    static findAll(city, name, type) {
        let queries = '';

        // Limit 10
        queries += `per_page=10`

        // Filter Breweries by City
        if(city && city.length) {
            queries += `by_city=${city}&`
        }

        // Filter Breweries by Name
        if(name && name.length) {
            queries += `by_name=${name}&`
        }

        // Filter Breweries by Type
        if(type && type.length) {
            queries += `by_type=${type}`
        }

        return request({
            url: `/breweries?${queries}`,
            method: "GET"
        });
    }
}
