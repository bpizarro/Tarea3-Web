/**
 * @pantalla HomeScreen
 *
 * Pantalla única de la aplicación.
 * - Usuario normal: ve el formulario de encuesta.
 * - Admin autenticado: ve pestañas "Formulario" y "Respuestas",
 *   navega entre ellas sin ser redirigido automáticamente.
 *   El header muestra "Admin activo" + botón "Salir" separados.
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppHeader } from '@presentation/components/layout/AppHeader'
import { SurveyForm } from '@presentation/components/form/SurveyForm'
import { LoginModal } from '@presentation/components/ui/LoginModal'
import { useAdminEntries } from '@presentation/hooks/useAdminEntries'
import { useTheme } from '@presentation/theme/ThemeContext'
import { fontSizes, fontWeights, spacing, radii } from '@presentation/theme/theme'
import type { SurveyEntry } from '@domain/entities/SurveyEntry'

type AdminTab = 'form' | 'responses'

export function HomeScreen() {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const isCompact = width < 380
  const [isAdmin, setIsAdmin] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('form')

  const handleLoginSuccess = () => {
    setIsAdmin(true)
    setModalVisible(false)
    // El usuario permanece en la pestaña "form" — no hay redirección automática
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setActiveTab('form')
  }

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Modal de login */}
        <LoginModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSuccess={handleLoginSuccess}
        />

        <View style={[styles.main, isCompact && styles.mainCompact]}>
          {/* Header */}
          <AppHeader
            isAdmin={isAdmin}
            onAdminPress={() => setModalVisible(true)}
            onLogout={handleLogout}
          />

          {/* Hero */}
          <View style={[styles.hero, { borderBottomColor: colors.bd }]}> 
            <Text style={[styles.heroTitle, { color: colors.tp }]}> 
              {activeTab === 'responses' && isAdmin
                ? 'Respuestas recibidas'
                : 'Tu opinión nos importa'}
            </Text>
            <Text style={[styles.heroSub, { color: colors.ts }]}> 
              {activeTab === 'responses' && isAdmin
                ? 'Visualiza, gestiona y exporta todas las respuestas.'
                : 'Completa el formulario y nuestro equipo se pondrá en contacto pronto.'}
            </Text>
          </View>

          {/* Pestañas — solo visibles cuando el admin está autenticado */}
          {isAdmin && (
            <View style={[styles.tabBar, { borderBottomColor: colors.bd, backgroundColor: colors.sur }]}> 
              <TouchableOpacity
                style={[styles.tab, activeTab === 'form' && { borderBottomColor: colors.ac }]}
                onPress={() => setActiveTab('form')}
              >
                <Text style={[
                  styles.tabText,
                  { color: activeTab === 'form' ? colors.ac : colors.tm },
                ]}>
                  📋 Formulario
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'responses' && { borderBottomColor: colors.ac }]}
                onPress={() => setActiveTab('responses')}
              >
                <Text style={[
                  styles.tabText,
                  { color: activeTab === 'responses' ? colors.ac : colors.tm },
                ]}>
                  📊 Respuestas
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Contenido */}
          {isAdmin && activeTab === 'responses'
            ? <AdminPanel />
            : <SurveyForm />
          }

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.bd }]}> 
            <Text style={[styles.footerText, { color: colors.tm }]}> 
              NexoForm · Datos almacenados en tu dispositivo · 2026
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  )
}

// ─────────────────────────────────────────────────────────────
// PANEL DE ADMINISTRACIÓN (sub-componente interno)
// ─────────────────────────────────────────────────────────────

function AdminPanel() {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const isCompact = width < 380
  const { entries, isLoading, isExporting, error, deleteEntry, exportEntries, refresh } = useAdminEntries()

  const confirmDelete = (entry: SurveyEntry) => {
    Alert.alert(
      'Eliminar respuesta',
      `¿Eliminar la respuesta de ${entry.fullName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => void deleteEntry(entry.id),
        },
      ],
    )
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.ac} size="large" />
      </View>
    )
  }

  return (
    <View style={[styles.flex, styles.adminPanel]}>
      {/* Barra de administración */}
      <View style={[
        styles.adminBar,
        isCompact && styles.adminBarCompact,
        { backgroundColor: colors.sur, borderColor: colors.bd },
      ]}> 
        <View style={styles.adminBarLeft}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={[styles.adminBarTitle, { color: colors.tp }]}>Panel Admin</Text>
          <Text style={[styles.countText, { color: colors.tm }]}>
            · {entries.length} respuesta{entries.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={[styles.adminBarActions, isCompact && styles.adminBarActionsCompact]}>
          <TouchableOpacity
            style={[styles.dlBtn, { backgroundColor: colors.as, borderColor: colors.bd }]}
            onPress={() => void exportEntries('csv')}
            disabled={isExporting || entries.length === 0}
          >
            <Text style={[styles.dlBtnText, { color: colors.ac }]}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dlBtn, { backgroundColor: colors.as, borderColor: colors.bd }]}
            onPress={() => void exportEntries('json')}
            disabled={isExporting || entries.length === 0}
          >
            <Text style={[styles.dlBtnText, { color: colors.ac }]}>JSON</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error al cargar */}
      {error ? (
        <Text style={[styles.errorText, { color: colors.er }]}>{error}</Text>
      ) : null}

      {/* Lista vacía */}
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={[styles.emptyText, { color: colors.tm }]}>
            Aún no hay respuestas guardadas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          contentContainerStyle={[
            styles.listContent,
            isCompact && styles.listContentCompact,
          ]}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <EntryCard entry={item} onDelete={() => confirmDelete(item)} />
          )}
        />
      )}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────
// TARJETA DE ENTRADA
// ─────────────────────────────────────────────────────────────

interface EntryCardProps {
  entry: SurveyEntry
  onDelete: () => void
}

function EntryCard({ entry, onDelete }: EntryCardProps) {
  const { colors } = useTheme()

  const initials = entry.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const dateFormatted = new Date(entry.submittedAt).toLocaleString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <View style={[styles.entryCard, { backgroundColor: colors.sur, borderColor: colors.bd }]}> 
      {/* Fila superior */}
      <View style={styles.entryTop}>
        <View style={[styles.avatar, { backgroundColor: colors.as, borderColor: colors.ac }]}>
          <Text style={[styles.avatarText, { color: colors.ac }]}>{initials}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={[styles.entryName, { color: colors.tp }]} numberOfLines={1}>
            {entry.fullName}
          </Text>
          <Text style={[styles.entryEmail, { color: colors.ts }]} numberOfLines={1}>
            {entry.email}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete} hitSlop={10} style={styles.deleteBtn}>
          <Text style={[styles.deleteIcon, { color: colors.tm }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Chips de metadatos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chips}>
          <Chip label={`📞 ${entry.phone}`} colors={colors} />
          {entry.company ? <Chip label={`🏢 ${entry.company}`} colors={colors} /> : null}
          <Chip label={`🕐 ${dateFormatted}`} colors={colors} />
        </View>
      </ScrollView>

      {/* Mensaje */}
      <View style={[styles.messageBox, { borderLeftColor: colors.ac }]}>
        <Text style={[styles.messageText, { color: colors.ts }]}>{entry.message}</Text>
      </View>
    </View>
  )
}

function Chip({ label, colors }: { label: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={[styles.chip, { backgroundColor: colors.elv, borderColor: colors.bd }]}>
      <Text style={[styles.chipText, { color: colors.ts }]}>{label}</Text>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  main: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  mainCompact: {
    maxWidth: '100%',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  heroTitle: {
    fontSize: fontSizes.xl + 4,
    fontWeight: fontWeights.extrabold,
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  heroSub: {
    fontSize: fontSizes.base,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  adminBarCompact: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  adminBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
  },
  shieldIcon: { fontSize: fontSizes.md },
  adminBarTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  countText: { fontSize: fontSizes.sm },
  adminBarActions: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  adminBarActionsCompact: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  dlBtn: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dlBtnText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  errorText: {
    textAlign: 'center',
    padding: spacing.lg,
    fontSize: fontSizes.base,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyIcon: { fontSize: 40, marginBottom: spacing.md },
  emptyText: { fontSize: fontSizes.base, textAlign: 'center' },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  listContentCompact: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  adminPanel: {
    flex: 1,
  },
  entryCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 680,
  },
  entryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  entryName: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  entryEmail: {
    fontSize: fontSizes.sm,
  },
  deleteBtn: { padding: spacing.xs },
  deleteIcon: { fontSize: fontSizes.base, fontWeight: fontWeights.bold },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  chipText: { fontSize: fontSizes.xs },
  messageBox: {
    borderLeftWidth: 3,
    paddingLeft: spacing.sm,
  },
  messageText: {
    fontSize: fontSizes.base,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSizes.xs,
    letterSpacing: 0.3,
  },
})
