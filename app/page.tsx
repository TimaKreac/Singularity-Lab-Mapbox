'use client';

import { MAPBOX_KEY } from '@/enviroment';
import { DEFAULT_COORDINATES } from '@/helpers/constants';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

export default function Home() {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_KEY;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [DEFAULT_COORDINATES.lng, DEFAULT_COORDINATES.lat],
      zoom: DEFAULT_COORDINATES.zoom,
    });
  }, []);

  return (
    <main
      id="map"
      className="flex min-h-screen flex-col
     items-center justify-between h-full"
    >
      <div ref={mapContainer} className="min-h-screen w-full" />
    </main>
  );
}
