/**
 * @componente SuccessBanner
 *
 * Banner de confirmación que aparece tras enviar el formulario exitosamente.
 * Incluye botón para cerrar manualmente.
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@theme/ThemeContext'
import { fontSizes, fontWeights, spacing, radii } from '@theme/theme'

interface SuccessBannerProps {
	onDismiss: () => void
}

export function SuccessBanner({ onDismiss }: SuccessBannerProps) {
	const { colors } = useTheme()

	return (
		<View style={[styles.container, { backgroundColor: colors.oks, borderColor: colors.ok }]}> 
			<Text style={[styles.text, { color: colors.ok }]}>✅ ¡Enviado correctamente! Tu respuesta ha sido guardada.</Text>
			<TouchableOpacity onPress={onDismiss} style={styles.closeBtn} hitSlop={8}>
				<Text style={[styles.closeText, { color: colors.ok }]}>✕</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: radii.sm,
		padding: spacing.md,
		marginBottom: spacing.md,
		gap: spacing.sm,
	},
	text: {
		flex: 1,
		fontSize: fontSizes.base,
		fontWeight: fontWeights.medium,
		lineHeight: 18,
	},
	closeBtn: {
		padding: spacing.xs,
	},
	closeText: {
		fontSize: fontSizes.md,
		fontWeight: fontWeights.bold,
	},
})
