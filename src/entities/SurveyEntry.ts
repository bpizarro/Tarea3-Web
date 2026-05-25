/**
 * @módulo Entidad de Dominio: SurveyEntry
 */

/** Identificador único de una entrada */
export type SurveyEntryId = string

export interface SurveyEntry {
  readonly id: SurveyEntryId
  readonly fullName: string
  readonly email: string
  readonly phone: string
  readonly company: string | null
  readonly message: string
  readonly submittedAt: string
}

export type CreateSurveyEntryInput = Omit<SurveyEntry, 'id' | 'submittedAt'>

export function createSurveyEntry(input: CreateSurveyEntryInput): SurveyEntry {
  return {
    id: `sv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    company: input.company?.trim() || null,
    message: input.message.trim(),
    submittedAt: new Date().toISOString(),
  }
}
