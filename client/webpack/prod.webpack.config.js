const path = require('path');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = require('./common.webpack.config.js');

module.exports = webpackMerge.merge(commonConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]-[local]-[contenthash:2]',
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                path: path.resolve(__dirname, '../')
              }
            }
          },
          'sass-loader',
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                path: path.resolve(__dirname, '../')
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules']
              }
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /mame.js/,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});
