/**
 * @módulo Implementación: SurveyRepositoryImpl
 */

import type { SurveyRepository } from '@repositories/SurveyRepository'
import type { SurveyEntry, SurveyEntryId, CreateSurveyEntryInput } from '@entities/SurveyEntry'
import { createSurveyEntry } from '@entities/SurveyEntry'
import { readFromStorage, writeToStorage, removeFromStorage } from '@storage/AsyncStorageAdapter'

export class SurveyRepositoryImpl implements SurveyRepository {
  private async readEntries(): Promise<SurveyEntry[]> {
    const data = await readFromStorage<SurveyEntry[]>()
    if (!Array.isArray(data)) return []
    return data
  }

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
