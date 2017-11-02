module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  entry: [ 'babel-polyfill', './src/main.js' ],
  output:'bundle.js',
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    open: true,
    port: 7622
  }
};
