/**
 * @módulo Hook: useAdminEntries
 *
 * ViewModel del panel de administración.
 * Gestiona la carga, eliminación y exportación de entradas.
 * Utiliza expo-file-system y expo-sharing para exportar archivos.
 */

import { useState, useEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import {
	getAllEntriesUseCase,
	deleteEntryUseCase,
	buildExportContent,
	type ExportFormat,
} from '@usecases/SurveyUseCases'
import { SurveyRepositoryImpl } from '@repositories/SurveyRepositoryImpl'
import type { SurveyEntry } from '@entities/SurveyEntry'

const repo = new SurveyRepositoryImpl()

export interface AdminEntriesState {
	entries: SurveyEntry[]
	isLoading: boolean
	isExporting: boolean
	error: string | null
}

export interface AdminEntriesActions {
	refresh: () => Promise<void>
	deleteEntry: (id: string) => Promise<void>
	exportEntries: (format: ExportFormat) => Promise<void>
}

export function useAdminEntries(): AdminEntriesState & AdminEntriesActions {
	const [entries, setEntries] = useState<SurveyEntry[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isExporting, setIsExporting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const refresh = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const data = await getAllEntriesUseCase(repo)
			setEntries(data)
		} catch (err) {
			console.error('[useAdminEntries] Error al cargar:', err)
			setError('No se pudieron cargar las respuestas.')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => { void refresh() }, [refresh])

	const deleteEntry = useCallback(async (id: string) => {
		await deleteEntryUseCase(repo, id)
		await refresh()
	}, [refresh])

	const exportEntries = useCallback(async (format: ExportFormat) => {
		if (entries.length === 0) return
		setIsExporting(true)

		try {
			const { content, filename, mimeType } = buildExportContent(entries, format)

			if (Platform.OS === 'web') {
				const blob = new Blob([content], { type: mimeType })
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = filename
				document.body.appendChild(link)
				link.click()
				link.remove()
				window.setTimeout(() => URL.revokeObjectURL(url), 0)
				return
			}

			const file = new File(Paths.cache, filename)
			file.write(content, { encoding: 'utf8' })

			const canShare = await Sharing.isAvailableAsync()
			if (!canShare) {
				setError('Tu dispositivo no soporta compartir archivos.')
				return
			}

			await Sharing.shareAsync(file.uri, {
				mimeType,
				dialogTitle: `Compartir ${format.toUpperCase()}`,
			})
		} catch (err) {
			console.error('[useAdminEntries] Error al exportar:', err)
			setError('No se pudo exportar el archivo.')
		} finally {
			setIsExporting(false)
		}
	}, [entries])

	return { entries, isLoading, isExporting, error, refresh, deleteEntry, exportEntries }
}
