#!/usr/bin/env node
/**
 * Simple script to copy ADMIN_USER and ADMIN_PASS from .env.local into app.json -> expo.extra
 * Usage: node ./scripts/sync-env-to-appjson.js
 */
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const envPath = path.join(root, '.env.local')
const appJsonPath = path.join(root, 'app.json')

function parseEnv(content) {
  const out = {}
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const idx = trimmed.indexOf('=')
    if (idx === -1) return
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    // remove optional surrounding quotes
    out[key] = val.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
  })
  return out
}

if (!fs.existsSync(envPath)) {
  console.error('.env.local not found — copia .env.example a .env.local y edita las variables.')
  process.exit(1)
}

const envRaw = fs.readFileSync(envPath, 'utf8')
const env = parseEnv(envRaw)

// Accept ADMIN_USER/ADMIN_PASS or EXPO_PUBLIC_ADMIN_USER/EXPO_PUBLIC_ADMIN_PASS
const adminUser = env.ADMIN_USER || env.EXPO_PUBLIC_ADMIN_USER
const adminPass = env.ADMIN_PASS || env.EXPO_PUBLIC_ADMIN_PASS

if (!adminUser || !adminPass) {
  console.error('ADMIN_USER/EXPO_PUBLIC_ADMIN_USER y ADMIN_PASS/EXPO_PUBLIC_ADMIN_PASS deben estar definidos en .env.local')
  process.exit(2)
}

if (!fs.existsSync(appJsonPath)) {
  console.error('app.json not found')
  process.exit(3)
}

const appJsonRaw = fs.readFileSync(appJsonPath, 'utf8')
let appJson
try {
  appJson = JSON.parse(appJsonRaw)
} catch (e) {
  console.error('Error parseando app.json:', e.message)
  process.exit(4)
}

appJson.expo = appJson.expo || {}
appJson.expo.extra = appJson.expo.extra || {}
appJson.expo.extra.ADMIN_USER = adminUser
appJson.expo.extra.ADMIN_PASS = adminPass
// Also set EXPO_PUBLIC_* variants for runtimes that expect them
appJson.expo.extra.EXPO_PUBLIC_ADMIN_USER = adminUser
appJson.expo.extra.EXPO_PUBLIC_ADMIN_PASS = adminPass

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n', 'utf8')
console.log('app.json actualizado con ADMIN_USER y ADMIN_PASS en expo.extra')
