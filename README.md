# CitiBike GBFS Live Tracker 🚲🛴

Una aplicación web en tiempo real para visualizar la disponibilidad de vehículos (bicicletas y scooters) del sistema de movilidad compartida de Lyft en la ciudad de Portland, utilizando el estándar **GBFS (General Bikeshare Feed Specification)**.

## 🚀 Características Principales

*   **Tiempo Real Robusto:** Consumo periódico del feed GBFS con intervalos configurables (1s, 5s, 10s, 30s, etc.) sin fugas de memoria.
*   **Mapa Interactivo de Alto Rendimiento:** Integración profunda con **MapLibre GL JS**, utilizando `Web Workers` nativos (inyectados vía assets de Angular) y capas GeoJSON para renderizar clusters de miles de vehículos eficientemente.
*   **Diseño Moderno y Responsivo:** Interfaz limpia con **Modo Oscuro (Dark Mode)** integrado, con una experiencia *mobile-first* (la barra lateral colapsa fluidamente).
*   **Filtros Dinámicos:** Búsqueda en tiempo real por el identificador del vehículo y tipo (Scooter/Bicicleta) sincronizada entre el mapa y el panel lateral.
*   **Sincronización Bidireccional:** Eventos centralizados. Al seleccionar un vehículo en la lista, el mapa vuela (`flyTo`) hacia sus coordenadas; al hacer clic en un pin del mapa, la lista realiza un auto-scroll suave hacia el vehículo seleccionado.
*   **Diccionarios Desacoplados:** Cero *magic strings*. Textos, temas, URLs y parámetros de la UI viven en diccionarios de configuración pura (`ui.config.ts`, `app.config.ts`, `map.config.ts`), facilitando enormemente su mantenimiento y escalabilidad a internacionalización (i18n).

## 🏗️ Arquitectura y Patrones de Diseño

El proyecto está diseñado bajo un enfoque de **Arquitectura Limpia (Clean Architecture)** adaptada al ecosistema moderno de Angular, promoviendo una estricta separación de responsabilidades, componentes tontos (Dumb Components) e Inteligentes (Smart Components).

### 1. State Management (Patrón Store/Facade)
Se ha implementado un patrón de gestión del estado local reactivo puro utilizando **Signals**.
*   **`VehicleStore`**: Actúa como la única fuente de la verdad (*Single Source of Truth*). Almacena primitivas reactivas puras (Signals) como `vehicles`, `loading`, `error`, `selectedVehicleId`.
*   **`VehicleSelectors`**: Encargado de la lógica derivada (`computed`). Procesa las signals base para generar proyecciones de estado listas para la UI (como los datos GeoJSON parseados o la lista de vehículos filtrada).
*   **`VehicleEffects`**: Aísla los efectos secundarios (Side Effects), encapsulando el inicio y fin de la suscripción al polling.
*   **`VehicleFacade`**: Sirve como punto de entrada público para la interfaz gráfica. Los componentes de la UI no mutan el estado directamente ni conocen de dónde vienen los datos; solo llaman métodos de la fachada (`startPolling()`, `setSearchQuery()`).

### 2. Angular Moderno (v22+)
*   **Standalone Components:** No se utilizan `NgModules`. Cada componente maneja su propio grafo de dependencias, reduciendo el acoplamiento y el tamaño de compilación.
*   **Control Flow:** Uso de las nuevas etiquetas de plantilla `@if`, `@for` (con la directiva `track` obligatoria por id para evitar renders costosos y repintados en el DOM al hacer diffing).
*   **Signals Inputs/Outputs:** Uso del API moderno de funciones `input()`, `input.required()` y `output()` en sustitución de los antiguos decoradores `@Input` y `@Output`, brindando un tipado infinitamente más estricto.
*   **Dependency Injection:** Se usa la función de inyección de propiedades `inject()` en lugar de los clásicos constructores llenos de dependencias privadas.

### 3. Delegación de Responsabilidades y Capa de Datos
*   **`GbfsApiService`:** Su única responsabilidad es realizar la petición HTTP e interceptar los errores de red, garantizando que el stream retorne un `VehicleState` manejable.
*   **Parsers (`vehicle.parser.ts`):** Aislan el esquema externo e inestable de la API (GBFS) del dominio interno, predecible y seguro de la aplicación (`Vehicle`). Cualquier cambio en la API externa solo requiere ajustar el parser, manteniendo el core intacto.
*   **`MaplibreWrapperService`:** Aísla el motor del mapa (altamente imperativo). Se comunica con Angular recibiendo el GeoJSON transformado y devolviendo el UUID del pin presionado, permitiendo mezclar el DOM imperativo con el ciclo de vida declarativo.

## 📂 Estructura de Directorios

```text
src/app/
├── core/                       # Lógica de dominio, estado global y servicios puramente lógicos
│   ├── config/                 # Diccionarios y configuraciones (ui.config.ts, map.config.ts)
│   ├── constants/              # Constantes de dominio y mensajes de error
│   ├── models/                 # Interfaces de TypeScript (Dominio vs GBFS Response)
│   ├── services/               # Servicios de infraestructura (GbfsApi, MaplibreWrapper, Polling)
│   ├── store/                  # Gestión del estado global reactivo (Store, Selectors, Effects, Facade)
│   └── utils/                  # Funciones puras (Parsers y adaptadores de datos)
├── features/                   # Componentes complejos y específicos del dominio de negocio
│   ├── map-container/          # Componente que hostea MapLibre
│   ├── vehicle-card/           # Tarjeta individual de cada vehículo
│   ├── vehicle-list/           # Lista autoscrollable de vehículos
│   └── vehicle-popup/          # Popup inyectado dinámicamente en el mapa
├── shared/                     # Componentes agnósticos reutilizables
│   ├── loading-state/          # Indicador de carga
│   ├── navbar/                 # Barra superior (Selector de refresco, switch de temas)
│   └── search-bar/             # Input de filtrado universal
└── app.ts / app.html           # Application Shell (Layout principal de la interfaz)
```

## ⚙️ Configuración y Despliegue Local

**1. Requisitos Previos:**
*   Node.js v26.0.0 (Recomendado usar `nvm` con el archivo `.nvmrc` provisto)
*   NPM v10+
*   Angular CLI v22+

**2. Instalación:**
```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd gbfs

# 2. Usar la versión correcta de Node (v26.0.0)
nvm use

# 3. Instalar dependencias
npm install
```

**3. Ejecución en Modo Desarrollo:**
```bash
npm start
```
La aplicación correrá en `http://localhost:4200/`. El build en caliente procesará los *Web Workers* de MapLibre automáticamente utilizando `esbuild` de Angular, tomándolos de la regla de *assets* en el `angular.json`.

---
## 🤖 Declaración de Transparencia sobre Uso de Inteligencia Artificial

Este proyecto fue desarrollado utilizando técnicas de Pair Programming con un agente de Inteligencia Artificial (Copilot). A continuación, declaro con honestidad el alcance de su uso:

### Qué se delegó a la IA:

- **Refactorización:** Se delegó a la IA la tarea de limpiar los "magic strings", mover configuraciones a diccionarios centralizados 

- **Lógica Espacial y Mapa:** Se utilizó a la IA para crear rápidamente el wrapper de `MapLibre GL JS` y configurar los esquemas complejos de GeoJSON (clusters, points, paint properties)

- **Delegación tests:**  Se delegó a la IA la creación de los tests unitarios y de integración para los componentes.