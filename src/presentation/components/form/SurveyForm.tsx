/**
 * @componente SurveyForm
 *
 * Formulario principal de encuesta y solicitud de servicio.
 * Usa el hook useSurveyForm como ViewModel.
 */

import React, { useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { useTheme } from '@presentation/theme/ThemeContext'
import { useSurveyForm } from '@presentation/hooks/useSurveyForm'
import { FormField } from '@presentation/components/ui/FormField'
import { SuccessBanner } from '@presentation/components/form/SuccessBanner'
import { fontSizes, fontWeights, spacing, radii } from '@presentation/theme/theme'
import type { FormData } from '@domain/usecases/SurveyUseCases'

export function SurveyForm() {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const isCompact = width < 380
  const {
    fields, errors, isSubmitting, isSuccess,
    handleChange, handleSubmit, resetSuccess,
  } = useSurveyForm()

  // Auto-oculta el banner de éxito tras 5 segundos
  useEffect(() => {
    if (!isSuccess) return
    const t = setTimeout(resetSuccess, 5000)
    return () => clearTimeout(t)
  }, [isSuccess, resetSuccess])

  // Fecha actual formateada
  const dateLabel = new Date().toLocaleDateString('es-CL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          isCompact && styles.scrollCompact,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta del formulario */}
        <View
          style={[
            styles.card,
            isCompact && styles.cardCompact,
            { backgroundColor: colors.sur, borderColor: colors.bd },
          ]}
        >
          {/* Encabezado de la tarjeta */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📋</Text>
            <View style={styles.flex}>
              <Text style={[styles.cardTitle, { color: colors.tp }]}>
                Encuesta & Solicitud de Servicio
              </Text>
              <Text style={[styles.cardSub, { color: colors.ts }]}>
                Cuéntanos sobre ti y cómo podemos ayudarte.
              </Text>
            </View>
          </View>

          {/* Badge de fecha */}
          <View style={[styles.dateBadge, { backgroundColor: colors.as, borderColor: colors.bd }]}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={[styles.dateText, { color: colors.ac }]} numberOfLines={1}>
              {dateLabel}
            </Text>
          </View>

          {/* Campos del formulario */}
          <FormField
            label="Nombre completo"
            required
            value={fields.fullName}
            onChangeText={(v) => handleChange('fullName', v)}
            error={errors.fullName}
            placeholder="Ej. Ana González"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <FormField
            label="Correo electrónico"
            required
            value={fields.email}
            onChangeText={(v) => handleChange('email', v)}
            error={errors.email}
            placeholder="ana@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
          <FormField
            label="Teléfono"
            required
            value={fields.phone}
            onChangeText={(v) => handleChange('phone', v)}
            error={errors.phone}
            placeholder="+56 9 1234 5678"
            keyboardType="phone-pad"
            returnKeyType="next"
          />
          <FormField
            label="Empresa"
            optional
            value={fields.company}
            onChangeText={(v) => handleChange('company' as keyof FormData, v)}
            placeholder="Nombre de tu empresa"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <FormField
            label="Mensaje / Descripción del servicio"
            required
            value={fields.message}
            onChangeText={(v) => handleChange('message', v)}
            error={errors.message}
            placeholder="Describe tu solicitud o comparte tus respuestas…"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textarea}
          />

          {/* Error global */}
          {errors._global ? (
            <View style={[styles.errorBox, { backgroundColor: colors.ers, borderColor: colors.er }]}>
              <Text style={[styles.errorText, { color: colors.er }]}>{errors._global}</Text>
            </View>
          ) : null}

          {/* Banner de éxito */}
          {isSuccess && <SuccessBanner onDismiss={resetSuccess} />}

          {/* Botón enviar */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: colors.ac, opacity: isSubmitting ? 0.65 : 1 },
            ]}
            onPress={() => void handleSubmit()}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitText}>Enviar respuesta →</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  scrollCompact: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
  },
  cardCompact: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardIcon: { fontSize: 22, marginTop: 2 },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSub: { fontSize: fontSizes.base },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: spacing.lg,
  },
  dateIcon: { fontSize: 12 },
  dateText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  textarea: {
    height: 120,
    minHeight: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: { fontSize: fontSizes.base },
  submitBtn: {
    borderRadius: radii.sm + 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  submitText: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.2,
  },
})
