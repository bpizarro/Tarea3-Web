/**
 * @módulo Tokens de Diseño: theme.ts
 *
 * Define el sistema de colores y tipografía para los temas claro y oscuro.
 * Todos los componentes consumen colores desde aquí — nunca valores hardcodeados.
 */

export interface ThemeColors {
	bg: string
	sur: string
	elv: string
	tp: string
	ts: string
	tm: string
	ac: string
	ach: string
	as: string
	ok: string
	oks: string
	er: string
	ers: string
	bd: string
	bdf: string
	shadow: string
}

export const lightColors: ThemeColors = {
	bg: '#F6F4F1',
	sur: '#FFFFFF',
	elv: '#EDEAE5',
	tp: '#18161A',
	ts: '#6B6560',
	tm: '#9E9890',
	ac: '#2563EB',
	ach: '#1D4ED8',
	as: '#EFF6FF',
	ok: '#15803D',
	oks: '#F0FDF4',
	er: '#DC2626',
	ers: '#FEF2F2',
	bd: '#E5E1DA',
	bdf: '#2563EB',
	shadow: 'rgba(0,0,0,0.10)',
}

export const darkColors: ThemeColors = {
	bg: '#0D0F18',
	sur: '#14172A',
	elv: '#1E2238',
	tp: '#F0EEF8',
	ts: '#A0A0B8',
	tm: '#606078',
	ac: '#60A5FA',
	ach: '#93C5FD',
	as: '#1A2840',
	ok: '#4ADE80',
	oks: '#052E16',
	er: '#F87171',
	ers: '#2D0707',
	bd: '#2A2D42',
	bdf: '#60A5FA',
	shadow: 'rgba(0,0,0,0.5)',
}

export const spacing = {
	xs: 4,
	sm: 8,
	md: 14,
	lg: 20,
	xl: 28,
	xxl: 40,
} as const

export const radii = {
	sm: 9,
	md: 13,
	lg: 18,
	full: 9999,
} as const

export const fontSizes = {
	xs: 10,
	sm: 11,
	base: 13,
	md: 14,
	lg: 16,
	xl: 18,
	xxl: 24,
	hero: 32,
} as const

export const fontWeights = {
	regular: '400' as const,
	medium: '500' as const,
	semibold: '600' as const,
	bold: '700' as const,
	extrabold: '800' as const,
}
