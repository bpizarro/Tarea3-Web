/**
 * @componente AppHeader
 *
 * Barra superior de la aplicación.
 * Contiene logo/marca, toggle de tema, y botones de admin/cerrar sesión.
 */

import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemeToggle } from '@components/ui/ThemeToggle'
import { useTheme } from '@theme/ThemeContext'
import { fontSizes, fontWeights, spacing, radii } from '@theme/theme'

interface AppHeaderProps {
	isAdmin: boolean
	onAdminPress: () => void
	onLogout: () => void
}

export function AppHeader({ isAdmin, onAdminPress, onLogout }: AppHeaderProps) {
	const { colors } = useTheme()
	const insets = useSafeAreaInsets()

	return (
		<View
			style={[
				styles.header,
				{
					backgroundColor: colors.sur,
					borderBottomColor: colors.bd,
					paddingTop: insets.top + spacing.sm,
				},
			]}
		>
			<View style={styles.brand}>
				<View style={[styles.logo, { backgroundColor: colors.ac }]}>
					<Text style={styles.logoText}>+</Text>
				</View>
				<View>
					<Text style={[styles.brandName, { color: colors.tp }]}>SurveyForm</Text>
					<Text style={[styles.brandTag, { color: colors.tm }]}>ENCUESTAS & SERVICIOS</Text>
				</View>
			</View>

			<View style={styles.actions}>
				<ThemeToggle />

				{isAdmin ? (
					<>
						<View style={[styles.adminBadge, { backgroundColor: colors.as, borderColor: colors.bdf }]}> 
							<Text style={[styles.adminBadgeText, { color: colors.ac }]}>🛡️ Admin</Text>
						</View>

						<TouchableOpacity
							style={[styles.logoutBtn, { backgroundColor: colors.ers, borderColor: colors.er }]}
							onPress={onLogout}
							activeOpacity={0.75}
						>
							<Text style={[styles.logoutText, { color: colors.er }]}>Salir</Text>
						</TouchableOpacity>
					</>
				) : (
					<TouchableOpacity
						style={[styles.adminBtn, { backgroundColor: colors.sur, borderColor: colors.bd }]}
						onPress={onAdminPress}
						activeOpacity={0.75}
					>
						<Text style={[styles.adminBtnText, { color: colors.ts }]}>🔐 Admin</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.sm,
		borderBottomWidth: 1,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.06,
				shadowRadius: 4,
			},
			android: { elevation: 3 },
		}),
	},
	brand: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	logo: {
		width: 32,
		height: 32,
		borderRadius: 9,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoText: {
		color: '#fff',
		fontSize: 20,
		fontWeight: fontWeights.bold,
		lineHeight: 22,
	},
	brandName: {
		fontSize: fontSizes.md,
		fontWeight: fontWeights.bold,
		lineHeight: 18,
	},
	brandTag: {
		fontSize: 8,
		fontWeight: fontWeights.semibold,
		letterSpacing: 0.8,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		flexWrap: 'wrap',
		justifyContent: 'flex-end',
	},
	adminBtn: {
		borderWidth: 1,
		borderRadius: radii.full,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	adminBtnText: {
		fontSize: fontSizes.sm,
		fontWeight: fontWeights.semibold,
	},
	adminBadge: {
		borderWidth: 1,
		borderRadius: radii.full,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	adminBadgeText: {
		fontSize: fontSizes.sm,
		fontWeight: fontWeights.semibold,
	},
	logoutBtn: {
		borderWidth: 1,
		borderRadius: radii.full,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	logoutText: {
		fontSize: fontSizes.sm,
		fontWeight: fontWeights.semibold,
	},
})
