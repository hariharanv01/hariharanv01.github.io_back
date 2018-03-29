//var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {

  entry: './react-dev/router.js',
  cache: true,
  devtool: 'cheap-module-source-map',
  // webpack folder's entry js - excluded from jekll's build process.
  output: {
    // we're going to put the generated file in the assets folder so jekyll will grab it.
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/assets/js/'),
    //need to compile to UMD or CommonJS so it can be requred in a Node context
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            eval: true,
            toplevel: true
          },
          beautify: false,
          parallel: true,
          compress: {
            warnings: false,
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            // screw_ie8: true,
            drop_console: true,
            ecma: 6,
            passes: 1,
            toplevel: true,
            unsafe_Function: true
          },
          output: {
            comments: false,
            ecma: 6,
          }
        }
      })
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // new webpack.optimize.DedupePlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveSplittingPlugin({
      minSize: 30000,
      maxSize: 1050000
    })
    // new webpack.optimize.AggressiveMergingPlugin(),
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.5
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: {
    //     eval: true,
    //     toplevel: true
    //   },
    //   beautify: false,
    //   parallel: true,
    //   compress: {
    //     warnings: false,
    //     pure_getters: true,
    //     unsafe: true,
    //     unsafe_comps: true,
    //     screw_ie8: true,
    //     drop_console: true,
    //     ecma: 6,
    //     passes: 3,
    //     toplevel: true,
    //     unsafe_Function: true,

    //   },
    //   output: {
    //     comments: false,
    //     ecma: 6,

    //   }
    // })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules',
        include: /flexboxgrid/,
      },
    ],

    // loaders: [
    //   {
    //     test: /\.jsx?$/,
    //     exclude: /(node_modules)/,
    //     loader: 'babel', // 'babel-loader' is also a legal name to reference
    //     query: {
    //       presets: ['react', 'es2015', 'stage-1']
    //     }
    //   },
    //   {
    //     test: /\.json$/,
    //     loader: 'json-loader'
    //   },
    //   {
    //     test: /\.css$/,
    //     loader: 'style!css?modules',
    //     include: /flexboxgrid/,
    //   },
    // ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  node: {
    console: true,
    fs: 'empty'
  }
};

module.exports = config;
