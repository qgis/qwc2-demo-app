const webpack = require('webpack');
const path = require('path');
const os = require('os');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
  new webpack.NormalModuleReplacementPlugin(/openlayers$/, path.join(__dirname, "qwc2", "libs", "openlayers")),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.LoaderOptionsPlugin({
      debug: !isProd,
      minimize: isProd
  })
];

if (isProd) {
  plugins.push(new LodashModuleReplacementPlugin());
  plugins.push(new TerserPlugin({
    parallel: true,
    sourceMap: true,
    terserOptions: {
      ecma: 8,
      output: {
        comments: false
      }
    }
  }));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  mode: nodeEnv === "production" ? "production" : "development",
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
    extensions: [".js", ".jsx"],
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2)(\?\w+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 50000,
            mimetype: "application/font-woff",
            name: "fonts/[name].[ext]",
          }
        }
      },
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
        exclude: os.platform() === 'win32' ? /node_modules\\(?!(qwc2)\\).*/ : /node_modules\/(?!(qwc2)\/).*/,
        use: {
            loader: 'babel-loader',
            options: { babelrcRoots: ['.', path.resolve(__dirname, 'node_modules', 'qwc2')] }
        }
      }
    ]
  },
  devServer: {
    hot: true,
    contentBase: './'
  }
};
