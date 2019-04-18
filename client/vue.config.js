var AppCachePlugin = require('appcache-webpack-plugin');
var manifest = new AppCachePlugin({
  cache: ['*'],
  fallback: [],
  output: 'manifest.appcache'
})

module.exports = {
  configureWebpack: {
    plugins: [
      manifest
    ]
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
}