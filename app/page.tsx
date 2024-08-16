'use client';

import { MAPBOX_KEY } from '@/enviroment';
import { DEFAULT_COORDINATES } from '@/helpers/constants';
import mapboxgl, { MapMouseEvent } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_KEY;

    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/mapbox/standard',
      center: [DEFAULT_COORDINATES.lng, DEFAULT_COORDINATES.lat],
      zoom: DEFAULT_COORDINATES.zoom,
      pitch: 50,
      bearing: 0,
      antialias: true,
    });

    const myMap = map.current as mapboxgl.Map;

    myMap.on('load', () => {
      if (myMap) {
        myMap.setConfigProperty('basemap', 'lightPreset', 'dusk');

        myMap.on('click', (e: MapMouseEvent) => {
          const features = myMap.queryRenderedFeatures(e.point);
          const feature = features?.[0];

          console.log('info', feature);

          if (feature && feature?.layer?.id === 'building') {
            const displayProperties = [
              'type',
              'properties',
              'id',
              'layer',
              'source',
              'sourceLayer',
              'state',
            ];

            const formattedFeatures = features.map((feat: any) => {
              const displayFeat = {} as any;

              displayProperties.forEach(prop => {
                displayFeat[prop] = feat[prop];
              });

              return displayFeat;
            });

            const info = JSON.stringify(formattedFeatures, null, 2);

            myMap.setFeatureState(
              { source: 'composite', id: feature?.id as string },
              { hover: true },
            );

            new mapboxgl.Popup()
              .setLngLat([e.lngLat.lng, e.lngLat.lat])
              .setHTML(
                `<pre
                  id="features"
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '50%',
                    overflow: 'auto',
                    background: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  ${info}
                </pre>`,
              )
              .addTo(myMap as mapboxgl.Map);
          }
        });

        myMap.on('mousemove', e => {
          const features = myMap.queryRenderedFeatures(e.point);

          const feature = features?.[0];

          if (feature?.layer?.id === 'building') {
            features[0];

            myMap.getCanvas().style.cursor = 'pointer';
          } else {
            myMap.getCanvas().style.cursor = '';
          }
        });

        myMap.setPaintProperty('Feature', 'icon-opacity', [
          'match',
          ['get', 'id'],
          '156278492',
          0.5,
          1,
        ]);
      }
    });

    return () => myMap.remove();
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
