const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const styleConfig = require("./styleConfig");

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';


let styleReplacements = Object.keys(styleConfig).map(key => ({search: "@" + key + "@", replace: styleConfig[key], flags: "g"}));

const plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
  }),
  new webpack.NormalModuleReplacementPlugin(/openlayers$/, path.join(__dirname, "qwc2", "libs", "openlayers")),
  new webpack.NoEmitOnErrorsPlugin()
];

if (!isProd) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  mode: isProd ? "production" : "development",
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
    extensions: [".mjs", ".js", ".jsx"],
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
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            esModule: false
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/, use: {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            limit: 8192,
            esModule: false
          }
        }
      },
      {
        test: /\.jsx?$/,
        exclude: os.platform() === 'win32' ? /node_modules\\(?!(qwc2)\\).*/ : /node_modules\/(?!(qwc2)\/).*/,
        use: {
            loader: 'babel-loader',
            options: { babelrcRoots: ['.', path.resolve(__dirname, 'node_modules', 'qwc2')] }
        }
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto'
    },
    {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"]
      }
    ]
  },
  devServer: {
    hot: true,
    contentBase: './',
    publicPath: '/dist'
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({parallel: true})
    ]
  }
};
