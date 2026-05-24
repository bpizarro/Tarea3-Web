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
import { useTheme } from '@presentation/theme/ThemeContext'
import { fontSizes, fontWeights, spacing, radii } from '@presentation/theme/theme'

// Credenciales hardcodeadas (ver advertencia de seguridad arriba)
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'nexo2026'

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
  const passRef = useRef<TextInput>(null)
  const cardWidth = Math.min(width - spacing.lg * 2, 380)
  const cardHeight = Math.min(Math.max(height * 0.52, 320), 440)
  const isCompact = width < 380

  // Limpia el formulario al cerrar
  useEffect(() => {
    if (!visible) {
      setUser('')
      setPass('')
      setError('')
    }
  }, [visible])

  const handleLogin = async () => {
    setError('')
    if (!user.trim() || !pass) {
      setError('⚠️ Completa todos los campos.')
      return
    }

    setIsLoading(true)
    // Delay mínimo para evitar timing attacks triviales
    await new Promise((r) => setTimeout(r, 400))
    setIsLoading(false)

    if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      onSuccess()
    } else {
      setError('⚠️ Credenciales incorrectas.')
      setPass('')
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
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

              {/* Campo contraseña */}
              <Text style={[styles.label, { color: colors.ts }]}>CONTRASEÑA</Text>
              <TextInput
                ref={passRef}
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.bd, color: colors.tp }]}
                value={pass}
                onChangeText={setPass}
                placeholder="••••••••"
                placeholderTextColor={colors.tm}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={() => void handleLogin()}
              />

              {/* Error */}
              {error ? (
                <View style={[styles.errorBox, { backgroundColor: colors.ers, borderColor: colors.er }]}> 
                  <Text style={[styles.errorText, { color: colors.er }]}>{error}</Text>
                </View>
              ) : null}

              {/* Botón de acción */}
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.ac, opacity: isLoading ? 0.65 : 1 }]}
                onPress={() => void handleLogin()}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.submitText}>Ingresar</Text>
                }
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
