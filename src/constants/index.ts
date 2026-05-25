/**
 * src/constants/index.ts
 *
 * Constantes globales de la aplicación.
 * Las credenciales se leen desde variables de entorno con prefijo
 * EXPO_PUBLIC_, que Expo inyecta en el bundle en tiempo de build.
 *
 * ADVERTENCIA DE SEGURIDAD:
 * Los valores EXPO_PUBLIC_* son visibles en el bundle compilado.
 * Un usuario técnico puede extraerlos del APK/IPA.
 * Esto es aceptable para demos o apps internas. Para producción
 * con datos sensibles, implementar autenticación en un backend.
 *

/** Credenciales del administrador leídas desde el entorno */
export const ADMIN_CREDENTIALS = {
  user: process.env.EXPO_PUBLIC_ADMIN_USER ?? '',
  pass: process.env.EXPO_PUBLIC_ADMIN_PASS ?? '',
} as const

/** Clave de almacenamiento en AsyncStorage */
export const STORAGE_KEY = 'survey_entries'

/** Clave para el tema guardado */
export const THEME_KEY = 'app_theme'

/** Tiempo en ms que se muestra el banner de éxito */
export const SUCCESS_BANNER_MS = 5000
