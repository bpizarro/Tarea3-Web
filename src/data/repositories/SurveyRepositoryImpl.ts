/**
 * @módulo Implementación: SurveyRepositoryImpl
 *
 * Implementa el contrato SurveyRepository usando AsyncStorage
 * como mecanismo de persistencia.
 *
 * Esta clase es la única que conoce cómo se guardan los datos.
 * Si se migra a SQLite o a una API REST, solo se cambia este archivo.
 */

import type { SurveyRepository } from '@domain/repositories/SurveyRepository'
import type { SurveyEntry, SurveyEntryId, CreateSurveyEntryInput } from '@domain/entities/SurveyEntry'
import { createSurveyEntry } from '@domain/entities/SurveyEntry'
import { readFromStorage, writeToStorage, removeFromStorage } from '@data/storage/AsyncStorageAdapter'

export class SurveyRepositoryImpl implements SurveyRepository {
  /** Lee el array de entradas desde AsyncStorage */
  private async readEntries(): Promise<SurveyEntry[]> {
    const data = await readFromStorage<SurveyEntry[]>()
    if (!Array.isArray(data)) return []
    return data
  }

  /** Escribe el array de entradas en AsyncStorage */
  private async writeEntries(entries: SurveyEntry[]): Promise<void> {
    await writeToStorage(entries)
  }

  async getAll(): Promise<SurveyEntry[]> {
    return this.readEntries()
  }

  async save(input: CreateSurveyEntryInput): Promise<SurveyEntry> {
    const entry = createSurveyEntry(input)
    const current = await this.readEntries()
    await this.writeEntries([...current, entry])
    return entry
  }

  async deleteById(id: SurveyEntryId): Promise<boolean> {
    const current = await this.readEntries()
    const filtered = current.filter((e) => e.id !== id)
    if (filtered.length === current.length) return false
    await this.writeEntries(filtered)
    return true
  }

  async deleteAll(): Promise<void> {
    await removeFromStorage()
  }
}
