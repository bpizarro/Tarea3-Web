import Constants from 'expo-constants'

/**
 * Lee credenciales desde varias fuentes de configuración:
 * - `Constants.expoConfig.extra` (app.json / app.config.ts / EAS)
 * - variables de entorno en `process.env` (útil en web/dev)
 * - soporta nombres comunes: ADMIN_*, EXPO_PUBLIC_*, VITE_*
 *
 * Esto evita hardcodeo en código, pero sigue siendo bundleable
 * cuando se inyecta en `app.json` — no es seguro para producción.
 */
export function getAdminCredentials(): { user: string; pass: string } | null {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, any>

  const user =
    extra?.adminUser ??
    extra?.ADMIN_USER ??
    extra?.EXPO_PUBLIC_ADMIN_USER ??
    extra?.VITE_ADMIN_USER ??
    process.env.ADMIN_USER ??
    process.env.EXPO_PUBLIC_ADMIN_USER ??
    process.env.VITE_ADMIN_USER ??
    null

  const pass =
    extra?.adminPass ??
    extra?.ADMIN_PASS ??
    extra?.EXPO_PUBLIC_ADMIN_PASS ??
    extra?.VITE_ADMIN_PASS ??
    process.env.ADMIN_PASS ??
    process.env.EXPO_PUBLIC_ADMIN_PASS ??
    process.env.VITE_ADMIN_PASS ??
    null

  if (!user || !pass) return null
  return { user, pass }
}

export const ADMIN_SESSION_KEY = 'surveyform_admin_session'