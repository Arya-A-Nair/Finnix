import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXJ5YXJveCIsImEiOiJjbGtwZGhsZGIyYXp0M2RrZzQ1YmRjeGVxIn0.t-ZYbpmvLe1KJdbh_RzkVQ';

const data = [
  [84.09252, 20.126544],
  [72.8869, 19.0749],
  [77.540296, 35.27113],
  [74.391281, 33.512488],
  [79.514329, 30.172141],
];

const from = [
  [72.8869, 19.0749],
  [77.540296, 35.27113],
  [74.391281, 33.512488],
  [79.514329, 30.172141],
];

const to = [84.09252, 20.126544];

function MapData() {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      // style: "mapbox://styles/mapbox/streets-v11",
      style: 'mapbox://styles/mapbox/light-v11',
      center: [76.933659, 23.699865],
      zoom: 4,
    });

    data.map((item) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([item[0], item[1]]) // Coordinates for the point to be displayed
        .addTo(map);
    });
    map.on('style.load', () => {
      from.map((item, index) => {
        map.addSource('line-source' + index, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                item,
                [(item[0] + to[0]) / 2 + 2, (item[1] + to[1]) / 2],
                to,
              ],
            },
          },
        });
        map.addLayer({
          id: 'line-layer' + index,
          type: 'line',
          source: 'line-source' + index,
          paint: {
            'line-color': '#ff0000',
            'line-width': 3,
            'line-opacity': 0.8,
            'line-dasharray': [2, 2],
          },
        });
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      style={{
        height: '90%',
        width: '100%',
        borderRadius: '0.5rem',
      }}
      id="map"
    >
      Big Map
    </div>
  );
}

export default MapData;
