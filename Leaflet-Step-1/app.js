//app.js
//@author: Jemima Florence

var usgsAllWeekEqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(usgsAllWeekEqUrl).then(function(data) {
   createFeatures(data.features);
});



function createFeatures(earthquakeData) {

    //Popup earthquake information for markers
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h5>" + feature.properties.place +
        "</h5><hr><p>" + new Date(feature.properties.time) + "</p>");
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
        onEachFeature: (feature, layer) => layer.bindPopup(
            "<h4>" + feature.properties.place + "</h4>" + 
            "<hr><p>" + new Date(feature.properties.time) + "</p>"
        ),
        pointToLayer: (feature, coordinates) => new L.circle(
            coordinates, {
                radius: feature.properties.mag * 15000,    
                fillColor: depthColor(feature.geometry.coordinates[2]),
                weight: 1,
                opacity: 1,
                color: 'black',  //Outline color
                fillOpacity: 0.7
            }
        )
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthQuakes) {

    var lightMapLayer = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={access_token}",{
           access_token: API_KEY,
           tileSize: 512,
           zoomOffset: -1,
        }   
    );

    var earthQuakeMap = L.map(
        "map", {
            center:[34.88,-100.99 ],
            zoom: 5,
            layers: [lightMapLayer, earthQuakes]
        }
    )

    var baseMaps = {"Light Map": lightMapLayer}
    var overlayMarkers = {Earthquakes: earthQuakes}

    L.control.layers(baseMaps, overlayMarkers, {
        collapsed: false
    }).addTo(earthQuakeMap);

    var legend = L.control({"position": "bottomright" });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");        
        div.innerHTML += '<i style="background: #a3f600"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #DCF400"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #F7DB11"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #FDB72A"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #FCA35D"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #FF5F65"></i><span>90+</span><br>';        

        return div;
    };

    legend.addTo(earthQuakeMap);

}