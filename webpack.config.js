const webpack = require('webpack');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const styleConfig = require("./styleConfig");

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';


let styleReplacements = Object.keys(styleConfig).map(key => ({search: "@" + key + "@", replace: styleConfig[key], flags: "g"}));

const plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin({
    "__DEVTOOLS__": !isProd
  }),
  new webpack.NormalModuleReplacementPlugin(/openlayers$/, path.join(__dirname, "qwc2", "MapStore2", "web", "client", "libs", "openlayers")),
  new webpack.NormalModuleReplacementPlugin(/proj4$/, path.join(__dirname, "qwc2", "MapStore2", "web", "client", "libs", "proj4")),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.LoaderOptionsPlugin({
      debug: !isProd,
      minimize: isProd
  }),
  new webpack.IgnorePlugin(/^(turf|leaflet.*)$/)
];

if (isProd) {
  plugins.push(new LodashModuleReplacementPlugin());
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      },
    })
  );
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  entry: {
    'webpack-dev-server': 'webpack-dev-server/client?http://0.0.0.0:8081',
    'webpack': 'webpack/hot/only-dev-server',
    'QWC2App': path.join(__dirname, "js", "app")
  },
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: "/dist/",
    filename: '[name].js'
  },
  plugins,
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'string-replace-loader', options: {multiple: styleReplacements}}
        ]
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader', query: {name: '[name].[ext]'} },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader', query: {name: '[path][name].[ext]', limit: 8192} }, // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader',
        include: [path.join(__dirname, "js"), path.join(__dirname, "qwc2", "QWC2Components"), path.join(__dirname, "qwc2", "MapStore2", "web", "client")]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    hot: true,
    contentBase: './'
  }
};
