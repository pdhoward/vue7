const path =                    require('path')
const webpack =                 require('webpack');
const ExtractTextPlugin =       require('extract-text-webpack-plugin');
const { VueLoaderPlugin } =     require('vue-loader')
const HtmlWebpackPlugin =       require('html-webpack-plugin')
const CopyWebpackPlugin =       require('copy-webpack-plugin')
const CleanWebpackPlugin =      require('clean-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')


let browserTargets = [
    '> 1%',
    'iOS >= 8.0',
    'Android >= 4.4',
    'Chrome >= 30',
    'Safari >= 9',
    'Firefox ESR',
    'Opera 12.1'
  ];
  
let babelOptions = {
    babelrc: false,
    presets: [ ['@babel/preset-env'] ]
  };

module.exports = (env, argv) => ({
  mode: argv && argv.mode || 'development',
  devtool: (argv && argv.mode || 'development') === 'production' ? 'source-map' : 'eval',

  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },

  node: false,

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: {
              loader: 'babel-loader',
              options: babelOptions
            }
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: babelOptions
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('postcss-smart-import')(),
                  require('postcss-url')(),
                  require('postcss-base64')({ extensions: ['.svg'], root: 'src' }),
                  require('postcss-cssnext')({ browsers: browserTargets })
                ]
              }
            }
          ]
        })
      }
    ]
  },

  resolve: {
    extensions: [
      '.js',
      '.vue',
      '.json'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    }
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      inject: true
    }),
    new CopyWebpackPlugin([{
      from: 'static/'
    }]),
    new SWPrecacheWebpackPlugin({
      cacheId: 'my-pwa-vue-app',
      filename: 'service-worker-cache.js',
      staticFileGlobs: ['dist/**/*.{js,css}', '/'],
      minify: true,
      stripPrefix: 'dist/',
      dontCacheBustUrlsMatching: /\.\w{6}\./
    })
  ],

  devServer: {    
    compress: true,
    host: 'localhost',
    https: false,
    open: true,
    overlay: true,
    port: 9000
  }
});