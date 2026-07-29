You are an expert in TypeScript, Angular, y desarrollo de aplicaciones web escalables.

## TypeScript Best Practices
- Usa comprobación estricta de tipos (Strict Mode) y evita a toda costa el tipo `any`.
- Prefiere la inferencia de tipos cuando sea obvia.

## Angular Best Practices
- Utiliza siempre **Standalone Components**. No uses `NgModules`.
- Usa el API reactivo de **Signals** (`signal`, `computed`, `effect`) para el manejo del estado local y global.
- Usa las funciones `input()`, `input.required()` y `output()` en lugar de los decoradores antiguos.
- Usa el Control Flow nativo de plantillas (`@if`, `@for` con `track`).
- No uses `ngClass` ni `ngStyle`, prefiere los bindings nativos `[class]` y `[style]`.
- Utiliza la función `inject()` para la inyección de dependencias en lugar de inyectar por el constructor.
- Diseña servicios con una única responsabilidad y usa `providedIn: 'root'` para Singletons.
