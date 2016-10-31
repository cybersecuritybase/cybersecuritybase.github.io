const webpack = require('webpack')
const path = require('path')
const resolve = path.resolve

module.exports = env => {
  return {
    entry: './src/index.js',
    output: {
      path: resolve('./dist'),
      filename: 'tmc-client' + (env.prod ? '.min.js' : '.js'),
      library: 'TmcClient',
      libraryTarget: 'var'
    },
    module: {
      loaders: [
        { test: /(\.jsx|\.js)$/, loader: 'babel!eslint', exclude: /(node_modules)/ },
        { test: /(\.jsx|\.js)$/, loader: "eslint-loader", exclude: /node_modules/ }
      ]
    },
    resolve: {
      root: path.resolve('./src'),
      extensions: ['', '.js']
    },
    plugins: [
      env.prod ? undefined : webpack.optimize.UglifyJsPlugin({ minimize: true })
    ].filter(p => !!p),
    devtool: 'source-map',
  }
}
