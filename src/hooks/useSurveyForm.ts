/**
 * @módulo Hook: useSurveyForm
 *
 * ViewModel del formulario de encuesta.
 * Gestiona el estado de campos, errores y envío.
 * Conecta la UI con el caso de uso submitSurveyUseCase.
 */

import { useState, useCallback } from 'react'
import { submitSurveyUseCase, type FormData } from '@usecases/SurveyUseCases'
import { SurveyRepositoryImpl } from '@repositories/SurveyRepositoryImpl'

const repo = new SurveyRepositoryImpl()

const INITIAL_FORM: FormData = {
	fullName: '',
	email: '',
	phone: '',
	company: '',
	message: '',
}

export interface SurveyFormState {
	fields: FormData
	errors: Partial<Record<keyof FormData | '_global', string>>
	isSubmitting: boolean
	isSuccess: boolean
}

export interface SurveyFormActions {
	handleChange: (field: keyof FormData, value: string) => void
	handleSubmit: () => Promise<void>
	resetSuccess: () => void
}

export function useSurveyForm(): SurveyFormState & SurveyFormActions {
	const [fields, setFields] = useState<FormData>(INITIAL_FORM)
	const [errors, setErrors] = useState<Partial<Record<keyof FormData | '_global', string>>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const handleChange = useCallback((field: keyof FormData, value: string) => {
		setFields((prev) => ({ ...prev, [field]: value }))
		setErrors((prev) => {
			const next = { ...prev }
			delete next[field]
			return next
		})
	}, [])

	const handleSubmit = useCallback(async () => {
		setErrors({})
		setIsSubmitting(true)

		const result = await submitSurveyUseCase(repo, fields)

		if (result.success) {
			setFields(INITIAL_FORM)
			setIsSuccess(true)
		} else {
			setErrors(result.errors)
		}

		setIsSubmitting(false)
	}, [fields])

	const resetSuccess = useCallback(() => setIsSuccess(false), [])

	return { fields, errors, isSubmitting, isSuccess, handleChange, handleSubmit, resetSuccess }
}
