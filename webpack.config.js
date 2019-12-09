const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.(png|jp(e*)g|svg|mp3|ttf|woff|eot)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  watch: true
};

module.exports = [
  {
    ...config,
    entry: path.join(__dirname, 'index.ts'),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/index.html')
      })
    ],
  }
];
