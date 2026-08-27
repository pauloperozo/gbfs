/**
 * Constant indicating whether the application is running in a browser environment.
 * Helps prevent errors during server-side rendering (SSR) or build-time rendering.
 */
export const IS_BROWSER = typeof window !== 'undefined';
