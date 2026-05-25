// app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SurveyForm',
  slug: 'survey-app',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#2563EB',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.surveyform.surveyapp',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#2563EB',
    },
    package: 'com.surveyform.surveyapp',
  },
  newArchEnabled: false,
  plugins: ['expo-secure-store'],
  extra: {
    // Leído en Node.js al iniciar el servidor — nunca hardcodeado
    adminUser: process.env.EXPO_PUBLIC_ADMIN_USER ?? '',
    adminPass: process.env.EXPO_PUBLIC_ADMIN_PASS ?? '',
  },
})