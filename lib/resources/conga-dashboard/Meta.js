const package = require('../../../package.json');

module.exports = {

    id: 'webpack',
    name: 'Webpack',
    description: 'Webpack',
    bundle: package.name,
    version: package.version,
    icon: 'data:image/png;base64,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'

}