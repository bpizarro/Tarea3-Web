/**
 * @módulo Contrato: SurveyRepository
 *
 * Define la interfaz que cualquier implementación de persistencia
 * debe cumplir. La capa de dominio depende de esta abstracción,
 * no de AsyncStorage ni de ninguna tecnología concreta.
 *
 * Principio: Dependency Inversion — depender de abstracciones.
 */

import type { SurveyEntry, SurveyEntryId, CreateSurveyEntryInput } from '@domain/entities/SurveyEntry'

export interface SurveyRepository {
  /** Obtiene todas las entradas almacenadas */
  getAll(): Promise<SurveyEntry[]>

  /** Guarda una nueva entrada y la retorna con ID y fecha asignados */
  save(input: CreateSurveyEntryInput): Promise<SurveyEntry>

  /** Elimina una entrada por ID. Retorna true si fue eliminada. */
  deleteById(id: SurveyEntryId): Promise<boolean>

  /** Elimina todas las entradas */
  deleteAll(): Promise<void>
}
