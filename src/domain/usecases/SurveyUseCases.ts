/**
 * @módulo Casos de Uso y Validaciones
 *
 * Contiene:
 * 1. Reglas de validación puras (Value Objects funcionales)
 * 2. Casos de uso: Submit, GetAll, Delete, Export
 *
 * Ninguna función aquí conoce React Native, AsyncStorage ni expo-sharing.
 * Toda dependencia externa se inyecta como parámetro.
 */

import type { SurveyRepository } from '@domain/repositories/SurveyRepository'
import type { SurveyEntry } from '@domain/entities/SurveyEntry'

// ─────────────────────────────────────────────────────────────
// VALIDACIONES
// ─────────────────────────────────────────────────────────────

/** Errores de validación del formulario por campo */
export interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  message?: string
}

/** Datos crudos del formulario antes de validar */
export interface FormData {
  fullName: string
  email: string
  phone: string
  company: string
  message: string
}

/** Valida todos los campos y retorna un mapa de errores (vacío si todo es válido) */
export function validateFormData(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.fullName.trim() || data.fullName.trim().length < 2)
    errors.fullName = 'El nombre completo es requerido (mínimo 2 caracteres).'

  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'El correo electrónico no es válido.'

  if (!data.phone.trim() || !/^\+?[\d\s\-().·]{7,18}$/.test(data.phone))
    errors.phone = 'El teléfono no tiene un formato válido.'

  if (!data.message.trim() || data.message.trim().length < 10)
    errors.message = 'El mensaje debe tener al menos 10 caracteres.'

  return errors
}

/** Verifica si el mapa de errores está vacío (formulario válido) */
export function isFormValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0
}

// ─────────────────────────────────────────────────────────────
// TIPOS DE RESULTADO
// ─────────────────────────────────────────────────────────────

/** Resultado discriminado de un caso de uso */
export type UseCaseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

// ─────────────────────────────────────────────────────────────
// CASO DE USO: Enviar encuesta
// ─────────────────────────────────────────────────────────────

/**
 * Valida y guarda una nueva respuesta de encuesta.
 *
 * @param repo - Repositorio inyectado
 * @param input - Datos crudos del formulario
 */
export async function submitSurveyUseCase(
  repo: SurveyRepository,
  input: FormData,
): Promise<UseCaseResult<SurveyEntry>> {
  const errors = validateFormData(input)
  if (!isFormValid(errors)) {
    return { success: false, errors: errors as Record<string, string> }
  }

  try {
    const entry = await repo.save({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      company: input.company || null,
      message: input.message,
    })
    return { success: true, data: entry }
  } catch (err) {
    console.error('[submitSurveyUseCase]', err)
    return { success: false, errors: { _global: 'Error al guardar. Intenta nuevamente.' } }
  }
}

// ─────────────────────────────────────────────────────────────
// CASO DE USO: Obtener todas las entradas
// ─────────────────────────────────────────────────────────────

/**
 * Retorna todas las entradas ordenadas de más reciente a más antigua.
 */
export async function getAllEntriesUseCase(repo: SurveyRepository): Promise<SurveyEntry[]> {
  const entries = await repo.getAll()
  return [...entries].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )
}

// ─────────────────────────────────────────────────────────────
// CASO DE USO: Eliminar una entrada
// ─────────────────────────────────────────────────────────────

export async function deleteEntryUseCase(
  repo: SurveyRepository,
  id: string,
): Promise<boolean> {
  return repo.deleteById(id)
}

// ─────────────────────────────────────────────────────────────
// CASO DE USO: Generar contenido de exportación
// ─────────────────────────────────────────────────────────────

export type ExportFormat = 'json' | 'csv'

/**
 * Genera el contenido del archivo de exportación como string.
 * La escritura física del archivo ocurre en la capa de datos.
 *
 * @param entries - Entradas a exportar
 * @param format  - 'json' o 'csv'
 * @returns Contenido del archivo como string y nombre sugerido
 */
export function buildExportContent(
  entries: SurveyEntry[],
  format: ExportFormat,
): { content: string; filename: string; mimeType: string } {
  const date = new Date().toISOString().slice(0, 10)

  if (format === 'json') {
    return {
      content: JSON.stringify(entries, null, 2),
      filename: `nexoform_respuestas_${date}.json`,
      mimeType: 'application/json',
    }
  }

  // CSV con BOM UTF-8 para compatibilidad con Excel
  const headers: (keyof SurveyEntry)[] = [
    'id', 'fullName', 'email', 'phone', 'company', 'message', 'submittedAt',
  ]
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = entries.map((e) => headers.map((h) => esc(e[h])).join(','))
  const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n')

  return {
    content: csv,
    filename: `nexoform_respuestas_${date}.csv`,
    mimeType: 'text/csv',
  }
}
