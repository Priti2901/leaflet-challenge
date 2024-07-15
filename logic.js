let myMap = L.map("map", {
    center: [61.217381, -149.863129],
    zoom:8
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function createMap(earthquakes) {
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMaps = {
        "Street Map": streetmap
    };

    var overlayMaps = {
        earthquakes: earthquakes
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap)
    };

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(queryUrl).then(function (data) {
    console.log(data);
    createFeatures(data.features);
});

function markerSize(magnitude) {
    return magnitude * 4000
}
 
function markerColor(depth) {
    if (depth > 90) return "indigo";
    else if (depth > 70) return "rebeccapurple";
    else if (depth > 50) return "slateblue";
    else if (depth > 30) return "violet";
    else if (depth > 10) return "thistle";
    else return "lavender";
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            var markers = {
                readius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                opacity: 1,
                fillOpacity: .8
            }
            return L.circle(latlng, markers);
        }
    });

    createMap(earthquakes);

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
           "lavender", "thistle", "violet","slateblue", "rebeccapurple", "indigo"
        ];

        for (var i=0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
                +grades[i] + (grades[i +1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(myMap);
};
