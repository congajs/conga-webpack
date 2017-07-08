const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    context: path.resolve(__dirname),

    entry: {
        app1: './app1.js',
        app2: './app2.js'
    },

    output: {
        filename: '[name].[chunkhash].bundle.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].[chunkhash].css')
    ],

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
          })
        }
      ]
    },

};
