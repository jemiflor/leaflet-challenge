//app.js
//@author: Jemima Florence

var usgsAllWeekEqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
   createFeatures(data.features);
});



function createFeatures(earthquakeData) {

    //Popup earthquake information for markers
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    //marker color by earthquake depth
    function depthColor(depth){
        if (depth >= -10 && depth <= 10){
            return "#a3f600"
        } else if (depth >= 10 && depth <= 30) {
            return "#DCF400"
        } else if (depth >= 30 && depth <= 50) {
            return "#F7DB11"
        } else if (depth >= 50 && depth <= 70) {
            return "#FDB72A"
        } else if (depth >= 70 && depth <= 90) {
            return "#FCA35D"
        } else if (depth >= 90) {
            return "#FF5F65"
        }
    }


    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, coordinates) => new L.circle(
            coordinates, {
                radius: feature.properties.mag * 500,
                color: depthColor(feature.geometry.coordinates[2])
            }
        )
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthQuakes) {

    var lightMapLayer = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/light-v10?{access_token}",{
           access_token: API_KEY
        }   
    );

    var earthQuakeMap = L.createMap(
        "map", {
            center:[38.88,-100.99 ],
            zoom: 5,
            layers: [lightMapLayer]
        }
    )

    var baseMaps = {"Light Map": lightMapLayer}
    var overlayMarkers = {Earthquakes: earthQuakes}

    L.control.layers(baseMaps, overlayMarkers, {
        collapsed: false
    }).addTo(earthQuakeMap);

}