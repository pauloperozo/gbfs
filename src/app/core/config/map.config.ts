export const MAP_CONFIG = {
  workerUrl: '/maplibre-gl-worker.mjs',
  style: {
    glyphsUrl: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    osmTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttribution: '&copy; OpenStreetMap contributors',
  },
  source: {
    cluster: true,
    clusterRadius: 50,
    clusterMaxZoom: 14,
  },
  layers: {
    sources: {
      vehicles: 'vehicles',
      osm: 'osm',
    },
    ids: {
      osm: 'osm',
      clusters: 'clusters-layer',
      clusterCount: 'cluster-count-layer',
      vehicles: 'vehicles-layer',
    },
    filters: {
      isCluster: ['has', 'point_count'] as any[],
      isNotCluster: ['!', ['has', 'point_count']] as any[],
    },
    colors: {
      clusterSmall: '#51bbd6',
      clusterMedium: '#f1f075',
      clusterLarge: '#f28cb1',
      clusterText: '#0f172a',
      vehicleDefault: '#002fa7',
      vehicleScooter: '#eab308',
      vehicleSelected: '#ef4444',
      strokeDefault: '#ffffff',
    },
    paint: {
      clusterRadius: ['step', ['get', 'point_count'], 18, 30, 24, 100, 32] as any[],
      clusterStrokeWidth: 2,
      vehicleRadius: ['interpolate', ['linear'], ['zoom'], 10, 4, 13, 7, 16, 11] as any[],
      vehicleStrokeWidthSelected: 3.5,
      vehicleStrokeWidthDefault: 1.5,
    },
    layout: {
      clusterTextField: ['to-string', ['get', 'point_count']] as any[],
      clusterTextFont: ['Noto Sans Regular'] as string[],
      clusterTextSize: 12,
    }
  },
  interactions: {
    clusterZoomOffset: 0.5,
    vehicleFlyToZoom: 15.5,
    vehicleFlyToSpeed: 1.2,
    vehicleFlyToCurve: 1.42,
  },
  popup: {
    className: 'custom-popup',
  },
  theme: {
    darkFilter: 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.1)',
  },
  geojson: {
    types: {
      featureCollection: 'FeatureCollection',
      feature: 'Feature',
      point: 'Point',
    },
  },
} as const;
