const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: ['fr']
    }),
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ]
};
