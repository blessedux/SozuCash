const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    popup: './src/popup/index.ts',
    background: './src/background/index.ts',
    twitterInject: './twitter-injection/src/twitter-inject.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/index.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: './src/manifest.json',
          to: 'manifest.json'
        },
        {
          from: './src/assets',
          to: 'assets'
        },
        {
          from: './src/styles',
          to: 'styles'
        },
        {
          from: './src/oauth-callback.html',
          to: 'oauth-callback.html'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}; 