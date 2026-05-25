/**
 * @componente LoginModal
 *
 * Modal de autenticación del administrador.
 * Cubre la pantalla con un fondo semitransparente y
 * presenta un formulario de usuario y contraseña.
 *
 * ADVERTENCIA DE SEGURIDAD: Las credenciales están embebidas
 * en el bundle de la app. Esto es aceptable para prototipos
 * y uso interno. Para producción real, usar autenticación backend.
 */

import React, { useState, useEffect, useRef } from 'react'
import {
	Modal,
	View,
	Text,
	TextInput,
	Pressable,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	ActivityIndicator,
	useWindowDimensions,
} from 'react-native'
import { useTheme } from '@theme/ThemeContext'
import { fontSizes, fontWeights, spacing, radii } from '@theme/theme'
import { getAdminCredentials } from '../../config/auth'

interface LoginModalProps {
	visible: boolean
	onClose: () => void
	onSuccess: () => void
}

export function LoginModal({ visible, onClose, onSuccess }: LoginModalProps) {
	const { colors } = useTheme()
	const { width, height } = useWindowDimensions()
	const [user, setUser] = useState('')
	const [pass, setPass] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	// Estado para mostrar u ocultar la contraseña
	const [showPass, setShowPass] = useState(false)
	const passRef = useRef<TextInput>(null)
	const cardWidth = Math.min(width - spacing.lg * 2, 380)
	const cardHeight = Math.min(Math.max(height * 0.52, 320), 460)
	const isCompact = width < 380

	// Limpiar campos al cerrar el modal
	useEffect(() => {
		if (!visible) {
			setUser('')
			setPass('')
			setError('')
			setShowPass(false)
		}
	}, [visible])

	const handleLogin = async () => {
		setError('')
		if (!user.trim() || !pass) {
			setError('⚠️ Completa todos los campos.')
			return
		}

		const creds = getAdminCredentials()
		if (!creds) {
			setError('⚠️ Credenciales admin no configuradas en la app. Revisa README para configurar ADMIN_USER y ADMIN_PASS.')
			return
		}

		setIsLoading(true)
		await new Promise((r) => setTimeout(r, 400))
		setIsLoading(false)

		if (user.trim() === creds.user && pass === creds.pass) {
			onSuccess()
		} else {
			setError('⚠️ Credenciales incorrectas.')
			setPass('')
		}
	}

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View style={styles.overlay}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.keyboardAvoid}
				>
					<View
						style={[
							styles.card,
							isCompact && styles.cardCompact,
							{
								backgroundColor: colors.sur,
								borderColor: colors.bd,
								width: cardWidth,
								height: cardHeight,
							},
						]}
					>
						<ScrollView
							keyboardShouldPersistTaps="handled"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.cardContent}
						>
							{/* Encabezado */}
							<View style={styles.header}>
								<Text style={styles.icon}>🔐</Text>
								<View style={styles.flex}>
									<Text style={[styles.title, { color: colors.tp }]}>Acceso Administrador</Text>
									<Text style={[styles.subtitle, { color: colors.tm }]}>Solo usuarios autorizados</Text>
								</View>
								<TouchableOpacity onPress={onClose} hitSlop={10}>
									<Text style={[styles.closeText, { color: colors.tm }]}>✕</Text>
								</TouchableOpacity>
							</View>

							{/* Campo usuario */}
							<Text style={[styles.label, { color: colors.ts }]}>USUARIO</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.bd, color: colors.tp }]}
								value={user}
								onChangeText={setUser}
								placeholder="admin"
								placeholderTextColor={colors.tm}
								autoCapitalize="none"
								autoCorrect={false}
								returnKeyType="next"
								onSubmitEditing={() => passRef.current?.focus()}
							/>

							{/* Campo contraseña con toggle de visibilidad */}
							<Text style={[styles.label, { color: colors.ts }]}>CONTRASEÑA</Text>
							<View style={styles.passWrapper}>
								<TextInput
									ref={passRef}
									style={[
										styles.input,
										styles.passInput,
										{ backgroundColor: colors.bg, borderColor: colors.bd, color: colors.tp },
									]}
									value={pass}
									onChangeText={setPass}
									placeholder="••••••••"
									placeholderTextColor={colors.tm}
									secureTextEntry={!showPass}
									returnKeyType="done"
									onSubmitEditing={() => void handleLogin()}
								/>
								{/* Botón para mostrar/ocultar contraseña */}
								<TouchableOpacity
									onPress={() => setShowPass((prev) => !prev)}
									hitSlop={10}
									style={styles.eyeBtn}
									accessibilityLabel={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
								>
									<Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
								</TouchableOpacity>
							</View>

							{/* Mensaje de error */}
							{error ? (
								<View style={[styles.errorBox, { backgroundColor: colors.ers, borderColor: colors.er }]}>
									<Text style={[styles.errorText, { color: colors.er }]}>{error}</Text>
								</View>
							) : null}

							{/* Botón ingresar */}
							<TouchableOpacity
								style={[styles.submitBtn, { backgroundColor: colors.ac, opacity: isLoading ? 0.65 : 1 }]}
								onPress={() => void handleLogin()}
								disabled={isLoading}
								activeOpacity={0.8}
							>
								{isLoading ? (
									<ActivityIndicator color="#fff" size="small" />
								) : (
									<Text style={styles.submitText}>Ingresar</Text>
								)}
							</TouchableOpacity>
						</ScrollView>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.lg,
	},
	card: {
		borderRadius: radii.lg,
		borderWidth: 1,
		overflow: 'hidden',
	},
	cardCompact: {
		borderRadius: radii.md,
	},
	cardContent: {
		padding: spacing.xl,
		gap: spacing.sm,
		flexGrow: 1,
		justifyContent: 'center',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		marginBottom: spacing.sm,
	},
	icon: { fontSize: fontSizes.xxl },
	flex: { flex: 1 },
	title: {
		fontSize: fontSizes.lg,
		fontWeight: fontWeights.bold,
	},
	subtitle: {
		fontSize: fontSizes.sm,
		marginTop: 2,
	},
	closeText: {
		fontSize: fontSizes.md,
		fontWeight: fontWeights.bold,
		padding: spacing.xs,
	},
	label: {
		fontSize: fontSizes.xs,
		fontWeight: fontWeights.semibold,
		letterSpacing: 0.4,
		marginTop: spacing.sm,
		marginBottom: spacing.xs,
	},
	input: {
		borderWidth: 1.5,
		borderRadius: radii.sm,
		width: '100%',
		paddingHorizontal: 13,
		paddingVertical: 10,
		fontSize: fontSizes.md,
	},
	// Contenedor relativo para posicionar el botón del ojo sobre el input
	passWrapper: {
		position: 'relative',
		justifyContent: 'center',
	},
	// Input de contraseña con padding derecho para no tapar el texto con el ícono
	passInput: {
		paddingRight: 44,
	},
	// Botón del ojo posicionado a la derecha del input
	eyeBtn: {
		position: 'absolute',
		right: 12,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
	},
	eyeIcon: {
		fontSize: 18,
	},
	errorBox: {
		borderWidth: 1,
		borderRadius: radii.sm,
		padding: spacing.md,
		marginTop: spacing.sm,
	},
	errorText: { fontSize: fontSizes.base },
	submitBtn: {
		borderRadius: radii.sm + 1,
		paddingVertical: 13,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: spacing.md,
	},
	submitText: {
		color: '#fff',
		fontSize: fontSizes.md,
		fontWeight: fontWeights.bold,
	},
	keyboardAvoid: {
		width: '100%',
		alignItems: 'center',
	},
})
