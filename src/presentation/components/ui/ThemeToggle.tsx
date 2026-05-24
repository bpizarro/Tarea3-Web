/**
 * @componente ThemeToggle
 *
 * Interruptor visual claro/oscuro con animación del thumb.
 * Idéntico al diseño del toggle web original.
 */

import React, { useRef, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native'
import { useTheme } from '@presentation/theme/ThemeContext'
import { fontSizes, spacing, radii } from '@presentation/theme/theme'

export function ThemeToggle() {
  const { mode, colors, toggleTheme } = useTheme()
  const isDark = mode === 'dark'

  // Animación del thumb (0 = claro, 1 = oscuro)
  const animation = useRef(new Animated.Value(isDark ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 8,
    }).start()
  }, [isDark, animation])

  // Interpola la posición horizontal del thumb
  const thumbLeft = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 18],
  })

  // Interpola el color del thumb
  const thumbColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FDD835', colors.ac],
  })

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.container, { borderColor: colors.bd }]}
      accessibilityLabel={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
      activeOpacity={0.8}
    >
      {/* Pista del toggle */}
      <View style={[styles.track, { backgroundColor: colors.elv, borderColor: colors.bd }]}>
        <Animated.View
          style={[
            styles.thumb,
            { left: thumbLeft, backgroundColor: thumbColor as unknown as string },
          ]}
        />
      </View>

      {/* Etiqueta */}
      <Text style={[styles.label, { color: colors.ts }]}>
        {isDark ? '🌙 Oscuro' : '☀️ Claro'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  track: {
    width: 34,
    height: 18,
    borderRadius: 10,
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
})
