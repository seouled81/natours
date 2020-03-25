const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoia2lrbzgxYiIsImEiOiJjazgwYWlpYW4wZjF6M2V1bjF6eGRpYnIwIn0.gyjVJ6ogR_0QTL2d17f-mQ';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kiko81b/ck80b1cce1ukz1iqanlt2k7gh',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker to map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend the map bounds
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};

export default displayMap;
