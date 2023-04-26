let myMap = L.map("map", {
  center: [37.09, -119.71],
  zoom: 5
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(myMap);

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(link)
.then(data => {
  // Loop through the earthquake data and create markers for each earthquake
  for (let i = 0; i < data.features.length; i++) {
    let earthquake = data.features[i];
    let lat = earthquake.geometry.coordinates[1];
    let lon = earthquake.geometry.coordinates[0];
    let mag = earthquake.properties.mag;
    let depth = earthquake.geometry.coordinates[2];
    let location = earthquake.properties.place;

    // Define the size and color of the marker based on the magnitude and depth of the earthquake
    let markerSize = mag * 5;
    let markerColor = getColor(depth);

    // Create a marker for the earthquake with a popup showing additional information
    let marker = L.circleMarker([lat, lon], {
      radius: markerSize,
      fillColor: markerColor,
      fillOpacity: 0.8,
      color: "#000",
      weight: 1,
      opacity: 1
    })
      .bindPopup('Magnitude: ' + mag + '<br>' + 'Location: ' + location + '<br>' + 'Depth: ' + depth + ' km')
      .addTo(myMap);

    // Add a click event listener to the marker to open the popup when clicked
    marker.on('click', () => {
      marker.openPopup();
    });
  }

  // Function to get color based on depth
  function getColor(depth) {
    if (depth < 10) {
      return "#00ff00";
    } else if (depth < 30) {
      return "#ffff00";
    } else if (depth < 50) {
      return "#ffa500";
    } else if (depth < 70) {
      return "#ff4500";
    } else {
      return "#8b0000";
    }
  }

  // Create a legend for the map
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    div.style.backgroundColor = '#ffffff';
    let depths = [-10, 10, 30, 50, 70, 90]; 
    let labels = [];

    // Loop through the depth ranges and create labels with corresponding colors
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i]) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
  };

  legend.addTo(myMap);
});
