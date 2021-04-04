const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    path.resolve(__dirname, '../index.jsx')
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules|avataaars/,
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.(woff2?|png|jpg|gif|mp3)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '/var/www'),
    publicPath: './'
  },
  plugins: [
    new webpack.DefinePlugin({
      productConfig: {
        extraLifeGameDay: `"${process.env.EXTRA_LIFE_GAME_DAY}"`,
        googleClientId: '"514963731806-0jv2ss1t2oirknel1bqtdqdat7sfs1t6.apps.googleusercontent.com"',
        version: `"${process.env.GAME_VERSION || 'latest'}"`
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
      favicon: path.resolve(__dirname, '../assets/gamecenter.png'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../assets/emulators/*'), to: '[path][name].[ext]' },
        { from: path.resolve(__dirname, '../assets/roms/*'), to: '[path][name].[ext]' }
      ]
    }),
  ],
  resolve: {
    alias: {
      '~/assets': path.resolve(__dirname, '../assets'),
      '~/atoms': path.resolve(__dirname, '../atoms'),
      '~/components': path.resolve(__dirname, '../components'),
      '~/hooks': path.resolve(__dirname, '../hooks'),
      '~/lib': path.resolve(__dirname, '../lib')
    },
    extensions: ['.js', '.jsx', '.json', '.scss'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: false
    },
    symlinks: false
  }
};
