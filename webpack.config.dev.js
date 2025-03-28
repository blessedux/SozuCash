const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    popup: './src/popup/index.ts',
    background: './src/background/index.ts',
    contentScript: './src/contentScript.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // for contentScript, we need separate CSS file
              emit: true,
            },
          },
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/index.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ExtensionReloader({
      reloadPage: true,
      entries: {
        background: 'background',
        contentScript: 'contentScript',
        popup: 'popup'
      }
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
    extensions: ['.ts', '.js']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
    port: 3000
  }
}; 