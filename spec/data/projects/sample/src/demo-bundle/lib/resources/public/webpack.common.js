const path = require('path');

module.exports = {
    context: path.resolve(__dirname),

    entry: {
        app1: './app1.js',
        app2: './app2.js'
    },
    output: {
        filename: '[name].[hash].bundle.js'
    }

};
