const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
      contentBase: './dist',
      clientLogLevel: 'silent',
      stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: 'ts-loader'
      },
      {
        test: /\.glsl$/i,
        use: 'raw-loader',
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
};