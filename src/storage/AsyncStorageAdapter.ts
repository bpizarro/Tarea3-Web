/**
 * @módulo Adaptador: AsyncStorageAdapter
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'surveyform_entries'

export async function readFromStorage<T>(key: string = STORAGE_KEY): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch (error) {
    console.error('[AsyncStorageAdapter] Error al leer:', error)
    return null
  }
}

export async function writeToStorage<T>(value: T, key: string = STORAGE_KEY): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('[AsyncStorageAdapter] Error al escribir:', error)
    throw new Error('No se pudo guardar en el dispositivo.')
  }
}

export async function removeFromStorage(key: string = STORAGE_KEY): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('[AsyncStorageAdapter] Error al eliminar:', error)
  }
}
