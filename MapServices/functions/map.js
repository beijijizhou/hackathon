// Initialize and add the map
let map;

async function MapServices() {
    const position = { lat: 25.344, lng: 131.031 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { Geocoder } = await google.maps.importLibrary("geocoding")
    const geocoder = new Geocoder()
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    // const zipCode = document.getElementById("zipCodeInput").value;
    const zipCode = "11357"
    console.log()
    const textQuery = "food bank near me"
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: position,
        mapId: "DEMO_MAP_ID",
    });
    geocoder.geocode({
        componentRestrictions: {
            country: "US",
            postalCode: zipCode,
        },
    }, async function (results, status) {
        if (status == 'OK') {
            var center = results[0].geometry.location
            map.setCenter(center);
            const request = {
                // required parameters
                textQuery: textQuery,
                fields: ["displayName", "location", "businessStatus"],
                maxResultCount: 5,
                language: "en-US",
                region: "us",
            };
            //@ts-ignore
            const { places } = await Place.searchByText(request);
            if (places.length) {
                console.log(places);

                const { LatLngBounds } = await google.maps.importLibrary("core");
                const bounds = new LatLngBounds();

                // Loop through and get all the results.
                places.forEach((place) => {
                    const markerView = new AdvancedMarkerElement({
                        map,
                        position: place.location,
                        title: place.displayName,
                    });

                    bounds.extend(place.location);
                    console.log(place);
                });
                map.fitBounds(bounds);
            } else {
                console.log("No results");
            }

        } else {
            window.alert('Geocode was not successful for the following reason: ' + status);
        }
    })



}

var searchButtons = document.getElementsByClassName("search");

// Loop through the HTMLCollection
for (var i = 0; i < searchButtons.length; i++) {
    // Attach event listener to each button
    searchButtons[i].addEventListener("click", MapServices);
}