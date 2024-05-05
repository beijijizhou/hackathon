// Initialize and add the map
let map;
var searchButtons = document.getElementsByClassName("search");

// Loop through the HTMLCollection
for (var i = 0; i < searchButtons.length; i++) {
    // Attach event listener to each button
    (function (index) {
        var buttonText = searchButtons[index].textContent// Capture the text content of the button
        searchButtons[index].addEventListener("click", function () {
            MapServices(buttonText); // Pass the captured text as a parameter
        });
    })(i);
}
async function MapServices(textContent) {
    const position = { lat: 25.344, lng: 131.031 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { Geocoder } = await google.maps.importLibrary("geocoding")
    const geocoder = new Geocoder()
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const zipCodeInput = document.getElementById("zipCodeInput");
    const zipCode = zipCodeInput.value;
    if (zipCode.length != 5) {
        window.alert("Please enter valid zipcode")
        return 
    }
    // console.log(zipCode)
    const textQuery = textContent
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
                locationBias: center,

                maxResultCount: 10,
                language: "en-US",
                region: "us",
            };
            //@ts-ignore
            const { places } = await Place.searchByText(request);
            if (places.length) {
                const { LatLngBounds } = await google.maps.importLibrary("core");
                const bounds = new LatLngBounds();
                const resultDiv = document.getElementById("searchResult");
                resultDiv.innerHTML = ""; // Clear all child elements

                // Loop through and get all the results.
                places.forEach(async (place) => {
                    
                    const markerView = new AdvancedMarkerElement({
                        map,
                        position: place.location,
                        title: place.displayName,
                    });
                    
                    bounds.extend(place.location);
                    const address = await reverseGeocode(place.location)
                    
                    displayMarkerDetails(address,place.displayName,resultDiv)
                   
                    
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

function displayMarkerDetails(address, title, resultDiv) {
    // Create new paragraph elements to display position and title


    const titleParagraph = document.createElement("h3");
    titleParagraph.textContent =   title ;
    const addressParagraph = document.createElement("p");
    // Append the paragraphs to the result div
    addressParagraph.textContent = "\nAddress:" + address;

    resultDiv.appendChild(titleParagraph);
    resultDiv.appendChild(addressParagraph);
}


async function reverseGeocode(latlng) {
    // Create a geocoder object
    const { Geocoder } = await google.maps.importLibrary("geocoding")
    const geocoder = new Geocoder()
  
    try {
      // Perform reverse geocoding
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
  
      if (response && response.length > 0) {
        // Extract the formatted address from the first result
        const formattedAddress = response[0].formatted_address;
        return formattedAddress;
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      throw new Error("Geocoder failed due to: " + error);
    }
  }