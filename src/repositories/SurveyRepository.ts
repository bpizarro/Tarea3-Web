/**
 * @módulo Contrato: SurveyRepository
 */

import type { SurveyEntry, SurveyEntryId, CreateSurveyEntryInput } from '@entities/SurveyEntry'

export interface SurveyRepository {
  getAll(): Promise<SurveyEntry[]>
  save(input: CreateSurveyEntryInput): Promise<SurveyEntry>
  deleteById(id: SurveyEntryId): Promise<boolean>
  deleteAll(): Promise<void>
}
