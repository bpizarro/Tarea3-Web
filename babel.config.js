// babel.config.js
// Configura el preset de Expo y el plugin de resolución de módulos
// para que los aliases por tipo sigan funcionando en tiempo de ejecución.

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@components':   './src/components',
            '@hooks':        './src/hooks',
            '@screens':      './src/screens',
            '@theme':        './src/theme',
            '@entities':     './src/entities',
            '@usecases':     './src/usecases',
            '@repositories': './src/repositories',
            '@storage':      './src/storage',
          },
        },
      ],
    ],
  }
}
