const path = require('path');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        admin: './admin.js'
    },
    output: {
      filename: '[name].[chunkhash].bundle.js'
    }
}
