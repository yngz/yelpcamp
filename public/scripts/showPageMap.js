mapboxgl.accessToken = mapboxToken;
campground_obj = JSON.parse(campground);

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campground_obj.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(campground_obj.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${campground_obj.title}</h3><p>${campground_obj.location}</p>`,
      ),
  )
  .addTo(map);
