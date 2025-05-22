const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // Add this line to set mode explicitly
  entry: {
    main: './src/index.js',
    UserResetPassword: './src/UserResetPassword.js',
    SellerResetPassword: './src/SellerResetPassword.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Add this line to resolve .jsx files
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Add .jsx extension here
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/, // Add rule to handle CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './public/UserResetPassword.html',
      filename: 'UserResetPassword.html',
      chunks: ['UserResetPassword'],
    }),
    new HtmlWebpackPlugin({
      template: './public/SellerResetPassword.html',
      filename: 'SellerResetPassword.html',
      chunks: ['SellerResetPassword'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
};
