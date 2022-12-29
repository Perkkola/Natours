export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZnJhbnNwZXJra29sYSIsImEiOiJjbDZmN2s2eWMwZXM5M29yd3pnYnN5aGlxIn0.fSqOfI7Rw4vIoswpGIt9Ww";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/fransperkkola/cl6f8ezll004916pkuzf4ybjb", // style URL
    scrollZoom: false,
    //   center: [-118.113491, 34.111745], // starting position [lng, lat]
    //   zoom: 9, // starting zoom
    //   interactive: false,
    //   projection: "globe", // display the map as a 3D globe
  });
  map.on("style.load", () => {
    map.setFog({}); // Set the default atmosphere style
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement("div");
    el.className = "marker";

    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
