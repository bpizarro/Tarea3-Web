// babel.config.js
// Configura el preset de Expo y el plugin de resolución de módulos
// para que los aliases @domain, @data, @presentation funcionen en tiempo de ejecución.
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
            '@domain':       './src/domain',
            '@data':         './src/data',
            '@presentation': './src/presentation',
          },
        },
      ],
    ],
  }
}
