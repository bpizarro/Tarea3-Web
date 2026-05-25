# SurveyForm — App Móvil y Web (React Native + Expo)

App de encuestas y solicitudes de servicio para iOS, Android y web, construida con **React Native**, **Expo SDK 54**, **TypeScript** y **arquitectura por capas**. En el cual puedes descargar y compartir los resultados en formato .csv y .json desde un panel admin.

---

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Ver la app en el celular](#ver-la-app-en-el-celular)
- [Ver la app en web](#ver-la-app-en-web)
- [Credenciales de administrador](#credenciales-de-administrador)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Arquitectura](#arquitectura)
- [Exportación de datos](#exportación-de-datos)
- [Nota de seguridad](#nota-de-seguridad)

---

## Tecnologías

| Tecnología | Versión | Rol |
|---|---|---|
| [Expo](https://expo.dev) | SDK 54 | Plataforma móvil |
| [React Native](https://reactnative.dev) | 0.81.5 | Framework UI nativo |
| [React](https://react.dev) | 19.1.0 | Motor de UI |
| [TypeScript](https://typescriptlang.org) | 5.9.x | Tipado estático |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | 2.2.0 | Persistencia local |
| [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/) | ~19.0.22 | Escritura de archivos |
| [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) | ~14.0.8 | Compartir archivos (CSV/JSON) |
| [expo-constants](https://docs.expo.dev/versions/latest/sdk/constants/) | — | Acceso a configuración en runtime |
| [react-dom](https://react.dev) | 19.1.0 | Soporte web |
| [react-native-web](https://necolas.github.io/react-native-web/) | ^0.21.0 | Render en navegador |


## Requisitos previos

- **Node.js** ≥ 18
- **npm** ≥ 9 (o pnpm / yarn)
- **Expo Go** instalado en tu dispositivo iOS o Android
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/survey-app.git
cd survey-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)
cp .env.example .env

# 4. Iniciar el servidor de desarrollo
npx expo start --clear
```

> Usa siempre `npx expo install <paquete>` para agregar dependencias nuevas.
> Esto garantiza que la versión sea compatible con el SDK 54.

---

## Variables de entorno

Las credenciales del administrador se configuran mediante variables de entorno, **nunca hardcodeadas** en el código ni en `app.json`.

### Configuración

Crea un archivo `.env` en la raíz del proyecto (nunca lo subas al repositorio):

```env
EXPO_PUBLIC_ADMIN_USER=admin
EXPO_PUBLIC_ADMIN_PASS=survey2026
```

El archivo `.env.example` incluido en el repositorio documenta las claves disponibles sin valores reales. Úsalo como plantilla.

### Cómo funcionan en Expo

El proyecto usa `app.config.ts` (en lugar de `app.json`) para leer las variables del `.env` en tiempo de arranque del servidor y pasarlas al bundle mediante `extra`:

```
.env
  └── app.config.ts (Node.js, tiempo de arranque)
        └── expo.extra.adminUser / adminPass
              └── src/config/auth.ts → getAdminCredentials()
                    └── LoginModal.tsx → handleLogin()
```

`Constants.expoConfig.extra` está disponible en todos los entornos: web, iOS y Android con Expo Go.

### Por qué no usar `process.env.EXPO_PUBLIC_*` directamente en el código

`process.env.EXPO_PUBLIC_*` solo funciona en web. En el dispositivo móvil con Expo Go, esas variables no llegan al bundle nativo. Por eso se leen en `app.config.ts` (que corre en Node.js) y se pasan por `extra`.

### Inicio con caché limpia (obligatorio al cambiar `.env`)

```bash
npx expo start --clear
```

Sin `--clear`, Expo Go puede usar la configuración anterior cacheada y los cambios no tendrán efecto.

---

## Ver la app en el celular

### Paso 1 — Iniciar el servidor

```bash
npx expo start --clear
```

Aparecerá un código QR en la terminal. Ábrelo con Expo Go:
- **Android**: escanea el QR desde la app Expo Go.
- **iOS**: escanea el QR desde la app Cámara del sistema.

> El computador y el teléfono deben estar en la **misma red WiFi**.

---

### Paso 2 — Abrir el puerto en el Firewall (Windows obligatorio)

En Windows, el Firewall de Windows Defender bloquea por defecto las conexiones entrantes. El síntoma es que Expo Go en el celular no carga la app o se queda intentando conectarse indefinidamente.

**Cómo crear la regla de excepción:**

1. Presiona `Win + R`, escribe `wf.msc` y presiona Enter.
2. En el panel izquierdo, click en **"Reglas de entrada"**.
3. En el panel derecho, click en **"Nueva regla..."**.
4. Completa el asistente con estos valores:

| Pantalla | Selección |
|---|---|
| Tipo de regla | **Puerto** |
| Protocolo | **TCP** |
| Puerto local específico | `8081` |
| Acción | **Permitir la conexión** |
| Perfil | Solo marcar **Privado** |
| Nombre | `Expo Dev Server` |

5. Click en **Finalizar** y escanea el QR de nuevo.

> Si usas el puerto `19000` o `19001` (Expo Go en modo tunnel), repite la regla para esos puertos también.

---

## Ver la app en web

```bash
npx expo start --web
```

Se abrirá automáticamente en `http://localhost:8081`.

Si no abre automáticamente, escríbelo manualmente en el navegador.

Si `--web` no funciona, instala el soporte web:

```bash
npx expo install react-dom react-native-web
```

En web, la exportación de respuestas (CSV/JSON) descarga el archivo directamente en el navegador.

---

## Credenciales de administrador

Las credenciales se configuran en el archivo `.env` (ver sección [Variables de entorno](#variables-de-entorno)).

Por defecto:

```
Usuario:    admin
Contraseña: survey2026
```

Para cambiarlas, edita el `.env` y reinicia el servidor con `npx expo start --clear`.

### Archivos relevantes

| Archivo | Rol |
|---|---|
| `.env` | Define `EXPO_PUBLIC_ADMIN_USER` y `EXPO_PUBLIC_ADMIN_PASS` |
| `app.config.ts` | Lee el `.env` y expone los valores en `extra` |
| `src/config/auth.ts` | Lee `Constants.expoConfig.extra` y retorna las credenciales |
| `src/components/ui/LoginModal.tsx` | Usa `getAdminCredentials()` para validar el login |

---

## Estructura de carpetas

```
survey-app/
├── App.tsx                         → Punto de entrada; monta providers y renderiza la raíz
├── app.config.ts                   → Configuración Expo dinámica; lee .env y expone extra
├── babel.config.js                 → Aliases en runtime: @components, @hooks, @screens,
│                                     @theme, @entities, @usecases, @repositories, @storage
├── tsconfig.json                   → Paths de TypeScript y opciones de compilación
├── package.json                    → Scripts y dependencias
├── .env                            → Variables de entorno locales (NO commitear)
├── .env.example                    → Plantilla de variables (SÍ commitear)
└── src/
    ├── config/
    │   └── auth.ts                 → Lee credenciales desde Constants.expoConfig.extra
    ├── components/
    │   ├── form/
    │   │   ├── SurveyForm.tsx      → Formulario; delega lógica a useSurveyForm
    │   │   └── SuccessBanner.tsx   → Banner de confirmación de envío
    │   ├── layout/
    │   │   └── AppHeader.tsx       → Cabecera con acciones globales (tema, admin)
    │   └── ui/
    │       ├── FormField.tsx       → Campo controlado con label y manejo de errores
    │       ├── LoginModal.tsx      → Modal de autenticación admin con toggle de contraseña
    │       └── ThemeToggle.tsx     → Control para alternar tema claro/oscuro
    ├── hooks/
    │   ├── useSurveyForm.ts        → Estado, validación y submit del formulario
    │   └── useAdminEntries.ts      → Carga, eliminación y exportación de entradas
    ├── screens/
    │   └── HomeScreen.tsx          → Composición de la UI principal
    ├── theme/
    │   ├── theme.ts                → Tokens de color, espaciado y tipografía
    │   └── ThemeContext.tsx        → Provider ThemeProvider y hook useTheme
    ├── entities/
    │   └── SurveyEntry.ts          → Tipo SurveyEntry y utilidades de creación
    ├── usecases/
    │   └── SurveyUseCases.ts       → submitSurveyUseCase, getAllEntriesUseCase,
    │                                  deleteEntryUseCase, buildExportContent
    ├── repositories/
    │   ├── SurveyRepository.ts     → Interfaz del repositorio (save, getAll, delete)
    │   └── SurveyRepositoryImpl.ts → Implementación concreta sobre AsyncStorageAdapter
    └── storage/
        └── AsyncStorageAdapter.ts  → Wrapper sobre AsyncStorage con fallback en web
```

---

## Arquitectura

El código está organizado por tipos pero respeta los principios de Clean Architecture. Regla principal: **la dependencia siempre apunta hacia adentro**.

```
UI (components / hooks / screens)
        ↓
   usecases (lógica pura)
        ↓
repositories (interfaces)
        ↓
repositories impl + storage adapters (I/O)
```

### Capas

**Entidades y casos de uso** (`src/entities`, `src/usecases`): código puro sin dependencias de React ni de plataforma. Contienen la lógica de negocio.

**UI y hooks** (`src/components`, `src/screens`, `src/hooks`): consumen casos de uso y entidades. Nunca importan implementaciones concretas de persistencia.

**Repositorios e I/O** (`src/repositories`, `src/storage`): implementaciones concretas que pueden importar AsyncStorage, expo-file-system y otras APIs de plataforma.

### Flujo de envío del formulario

```
Usuario escribe → SurveyForm (component)
                        ↓
              useSurveyForm (hook / ViewModel)
                        ↓
          submitSurveyUseCase (lógica pura)
                        ↓
        SurveyRepository (interfaz) → SurveyRepositoryImpl → AsyncStorageAdapter
```

---

## Exportación de datos

Cuando el admin presiona un botón de exportación:

1. `buildExportContent` (caso de uso puro) genera el contenido del archivo en memoria.
2. En **web**: el archivo se descarga directamente desde el navegador.
3. En **móvil**: `Sharing.shareAsync` abre el sheet nativo del sistema operativo.
   - **iOS**: AirDrop, Mail, Archivos, etc.
   - **Android**: Google Drive, WhatsApp, guardar en dispositivo, etc.

---

## Nota de seguridad

Las credenciales del administrador se leen desde variables de entorno y se pasan al bundle a través de `app.config.ts → extra`. Aunque esto evita el hardcodeo en el código fuente, los valores **siguen estando en el bundle compilado** y pueden extraerse con reverse engineering del APK o IPA.

Esto es aceptable para:
- Prototipos y demos internas
- Uso offline o en red controlada
- Datos no altamente sensibles

Para producción con datos sensibles se recomienda:
- Autenticación backend con JWT
- Endpoints HTTPS con rate limiting
- Hashing de contraseñas con bcrypt o argon2
- EAS Secrets para variables en el pipeline de build
