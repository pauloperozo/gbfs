export const UI_CONFIG = {
  connection: {
    labels: {
      live: 'Conectado (Live)',
      loading: 'Actualizando...',
      fallbackTime: '--:--:--',
    },
    tones: {
      live: 'live',
      loading: 'loading',
      fallback: 'fallback',
    },
    locale: 'es-ES',
  },
  dictionary: {
    vehicleType: {
      scooter: 'Scooter',
      bike: 'Bicicleta',
      scooterIcon: '🛴 Scooter',
      bikeIcon: '🚲 Bicicleta',
      scooterEmoji: '🛴',
      bikeEmoji: '🚲',
    },
    status: {
      maintenance: 'Mantenimiento',
      reserved: 'Reservado',
      available: 'Disponible',
    },
    labels: {
      type: 'Tipo',
      lat: 'Lat',
      lng: 'Lng',
      vehicleDetail: 'Detalle del Vehículo',
      emptySelectionTitle: 'Selecciona un vehículo',
      emptySelectionBody: 'Haz clic en una tarjeta o en un punto del mapa para ver su detalle técnico.',
      emptyListTitle: 'Sin resultados',
      emptyListBody: 'Prueba con otro name o espera la siguiente actualización del feed.',
      appTitle: 'CitiBike GBFS Live Tracker',
      vehiclesCount: 'vehículos',
      refreshRate: 'Actualizar cada:',
      searchPlaceholder: 'Filtrar por name o tipo...',
      loading: 'Cargando...',
      loadingGbfs: 'Cargando vehículos GBFS...',
      footerCopyright: '© 2026',
      footerTracker: 'GBFS Live Tracker',
      lastUpdate: 'Última actualización:',
    },
    theme: {
      lightIcon: '☀️',
      darkIcon: '🌙',
      storageKey: 'gbfs-theme',
      darkValue: 'dark',
      lightValue: 'light',
      attributeName: 'data-theme'
    }
  }
} as const;

export type ConnectionTone = typeof UI_CONFIG.connection.tones[keyof typeof UI_CONFIG.connection.tones];

