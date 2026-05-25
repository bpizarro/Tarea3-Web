/**
 * @módulo Casos de Uso y Validaciones
 */

import type { SurveyRepository } from '@repositories/SurveyRepository'
import type { SurveyEntry } from '@entities/SurveyEntry'

export interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  message?: string
}

export interface FormData {
  fullName: string
  email: string
  phone: string
  company: string
  message: string
}

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

export function isFormValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0
}

export type UseCaseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

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

export async function getAllEntriesUseCase(repo: SurveyRepository): Promise<SurveyEntry[]> {
  const entries = await repo.getAll()
  return [...entries].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )
}

export async function deleteEntryUseCase(repo: SurveyRepository, id: string): Promise<boolean> {
  return repo.deleteById(id)
}

export type ExportFormat = 'json' | 'csv'

export function buildExportContent(
  entries: SurveyEntry[],
  format: ExportFormat,
): { content: string; filename: string; mimeType: string } {
  const date = new Date().toISOString().slice(0, 10)

  if (format === 'json') {
    return {
      content: JSON.stringify(entries, null, 2),
      filename: `surveyform_respuestas_${date}.json`,
      mimeType: 'application/json',
    }
  }

  const headers: (keyof SurveyEntry)[] = [
    'id', 'fullName', 'email', 'phone', 'company', 'message', 'submittedAt',
  ]
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = entries.map((e) => headers.map((h) => esc(e[h])).join(','))
  const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n')

  return {
    content: csv,
    filename: `surveyform_respuestas_${date}.csv`,
    mimeType: 'text/csv',
  }
}
