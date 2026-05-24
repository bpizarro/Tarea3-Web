/**
 * @módulo Contexto de Tema: ThemeContext
 *
 * Gestiona el tema visual (claro/oscuro) a nivel global.
 * Lee la preferencia del sistema operativo como valor inicial
 * y permite al usuario alternarlo manualmente (se persiste en AsyncStorage).
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightColors, darkColors, type ThemeColors } from './theme'

export type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  colors: ThemeColors
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = 'nexoform_theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Preferencia del sistema operativo como fallback
  const systemScheme = useColorScheme()
  const [mode, setMode] = useState<ThemeMode>('light')
  const [loaded, setLoaded] = useState(false)

  // Carga la preferencia guardada al iniciar
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') {
          setMode(stored)
        } else {
          setMode(systemScheme === 'dark' ? 'dark' : 'light')
        }
      })
      .catch(() => {
        setMode(systemScheme === 'dark' ? 'dark' : 'light')
      })
      .finally(() => setLoaded(true))
  }, [systemScheme])

  const toggleTheme = () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setMode(next)
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(console.error)
  }

  // No renderiza hasta tener el tema correcto para evitar flash
  if (!loaded) return null

  const colors = mode === 'dark' ? darkColors : lightColors

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark: mode === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/** Hook para consumir el tema actual */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
