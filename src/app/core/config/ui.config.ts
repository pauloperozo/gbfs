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
    login: {
      title: 'CitiBike Live Tracker',
      subtitle: 'Monitoreo de vehículos GBFS en tiempo real',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'admin@test.com',
      emailRequired: 'El correo electrónico es requerido.',
      emailInvalid: 'Formato no válido.',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'password123',
      passwordRequired: 'La contraseña es requerida.',
      passwordMinLength: 'Debe tener al menos 6 caracteres.',
      forgotPassword: '¿La olvidaste?',
      rememberMe: 'Recuérdame',
      submitBtn: 'Iniciar Sesión',
      submitBtnLoading: 'Iniciando sesión...',
      orDivider: 'o continuar con',
      googleBtn: 'Iniciar sesión con Google',
      themeAriaLabel: 'Cambiar tema',
      downloadAndroidLabel: 'Descargar App para Android',
      androidDownloadUrl: 'https://play.google.com/store/apps/details?id=com.citibike.tracker',
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

