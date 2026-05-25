/**
 * @módulo App
 *
 * Punto de entrada de la aplicación React Native.
 * Configura los proveedores globales:
 * 1. ThemeProvider  — tema claro/oscuro
 * 2. HomeScreen     — pantalla única
 *
 * La app no usa navegación (react-navigation) porque es
 * una single-screen app — todo el routing ocurre
 * mediante estado local en HomeScreen.
 */

import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useTheme } from '@theme/ThemeContext'
import { HomeScreen } from '@screens/HomeScreen'

/** Wrapper interno que puede acceder al tema para el StatusBar */
function AppContent() {
  const { mode } = useTheme()
  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <HomeScreen />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
