const {map} = await google.maps.importLibrary("maps");

new Map(document.getElementById("map"),{
    zoom:5,
    center:{lat:50, lng:50}
});