/**
 * @componente FormField
 *
 * Campo de formulario reutilizable con label, input, indicador
 * de requerido/opcional y mensaje de error.
 */

import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	type TextInputProps,
} from 'react-native'
import { useTheme } from '@theme/ThemeContext'
import { fontSizes, fontWeights, radii, spacing } from '@theme/theme'

interface FormFieldProps extends TextInputProps {
	label: string
	error?: string
	required?: boolean
	optional?: boolean
}

export function FormField({ label, error, required, optional, ...inputProps }: FormFieldProps) {
	const { colors } = useTheme()
	const [isFocused, setIsFocused] = useState(false)
	const { style: inputStyle, ...restInputProps } = inputProps

	return (
		<View style={styles.container}>
			<View style={styles.labelRow}>
				<Text style={[styles.label, { color: colors.ts }]}>{label.toUpperCase()}</Text>
				{required && <Text style={[styles.required, { color: colors.ac }]}> *</Text>}
				{optional && <Text style={[styles.optional, { color: colors.tm }]}> (opcional)</Text>}
			</View>

			<TextInput
				style={[
					styles.input,
					{
						backgroundColor: colors.bg,
						borderColor: error ? colors.er : isFocused ? colors.bdf : colors.bd,
						color: colors.tp,
					},
					inputStyle,
				]}
				placeholderTextColor={colors.tm}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				{...restInputProps}
			/>

			{error ? <Text style={[styles.error, { color: colors.er }]}>{error}</Text> : null}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	labelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: spacing.xs,
	},
	label: {
		fontSize: fontSizes.xs,
		fontWeight: fontWeights.semibold,
		letterSpacing: 0.4,
	},
	required: {
		fontSize: fontSizes.xs,
		fontWeight: fontWeights.semibold,
	},
	optional: {
		fontSize: fontSizes.xs,
		fontWeight: fontWeights.regular,
	},
	input: {
		borderWidth: 1.5,
		borderRadius: radii.sm,
		width: '100%',
		paddingHorizontal: 13,
		paddingVertical: 10,
		fontSize: fontSizes.md,
		fontFamily: 'System',
	},
	error: {
		fontSize: fontSizes.xs,
		marginTop: spacing.xs,
	},
})
