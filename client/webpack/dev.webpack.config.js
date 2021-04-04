const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./common.webpack.config.js');

module.exports = webpackMerge.merge(commonConfig, {
  devServer: {
    compress: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    overlay: true,
    port: 3000
  },
  devtool: 'cheap-module-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]-[local]-[contenthash:2]',
              },
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, '../style/variables.scss')
              ]
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        exclude: /\.module.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, '../style/variables.scss')
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});