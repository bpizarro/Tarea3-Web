/**
 * @módulo Entidad de Dominio: SurveyEntry
 *
 * Representa una respuesta enviada por un usuario del formulario.
 * Esta entidad es pura: no depende de React Native, AsyncStorage
 * ni ningún framework externo.
 *
 * Principio aplicado: las entidades de dominio son el núcleo del sistema
 * y no deben conocer cómo se persisten ni cómo se presentan.
 */

/** Identificador único de una entrada */
export type SurveyEntryId = string

/** Estructura inmutable de una respuesta de encuesta */
export interface SurveyEntry {
  readonly id: SurveyEntryId
  readonly fullName: string
  readonly email: string
  readonly phone: string
  /** Empresa del usuario (campo opcional) */
  readonly company: string | null
  readonly message: string
  /** Fecha de envío en formato ISO 8601 */
  readonly submittedAt: string
}

/** Datos necesarios para crear una nueva entrada (sin id ni fecha) */
export type CreateSurveyEntryInput = Omit<SurveyEntry, 'id' | 'submittedAt'>

/**
 * Fábrica de entidades SurveyEntry.
 * Genera el ID único y la fecha de envío automáticamente.
 *
 * @param input - Datos validados del formulario
 * @returns Entidad SurveyEntry completa e inmutable
 */
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
