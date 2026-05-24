/**
 * @módulo Adaptador: AsyncStorageAdapter
 *
 * Encapsula las operaciones de lectura/escritura sobre AsyncStorage.
 * AsyncStorage es el equivalente móvil de localStorage:
 * almacenamiento clave-valor asíncrono y persistente en el dispositivo.
 *
 * Límite de AsyncStorage: ~6MB por defecto en Android.
 * Para volúmenes mayores, migrar a expo-sqlite.
 *
 * ADVERTENCIA DE SEGURIDAD: AsyncStorage no está cifrado.
 * No almacenar datos altamente sensibles sin cifrado adicional.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

/** Clave bajo la que se almacena el array de entradas */
const STORAGE_KEY = 'nexoform_entries'

/**
 * Lee y parsea el valor almacenado bajo la clave dada.
 * Retorna null si la clave no existe o el valor es inválido.
 */
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

/**
 * Serializa y escribe un valor bajo la clave dada.
 */
export async function writeToStorage<T>(value: T, key: string = STORAGE_KEY): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('[AsyncStorageAdapter] Error al escribir:', error)
    throw new Error('No se pudo guardar en el dispositivo.')
  }
}

/**
 * Elimina el valor asociado a la clave dada.
 */
export async function removeFromStorage(key: string = STORAGE_KEY): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('[AsyncStorageAdapter] Error al eliminar:', error)
  }
}
