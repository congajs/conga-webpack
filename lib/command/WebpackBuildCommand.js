/*
 * This file is part of the conga-webpack module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// native modules
var fs = require('fs');
var path = require('path');

// third-party modules
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');

/**
 * This command compiles the configured webpack entries
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = {

	/**
	 * Set up configuration for this command
	 *
	 * @var {Object}
	 */
	config: {
		command: "webpack:compile",
		description: "Compile the configured webpack entries",
		// options: {
		// 	'foo' : ['-f, --foo [value]', 'some foo']
		// },
		// arguments: ['name']
	},

	/**
	 * Run the command
	 *
	 * @return {void}
	 */
	run: function(container, args, options, cb){

		container.get('logger').debug('running webpack:compile');

        const config = container.get('config').get('webpack');
        const webpackConfigPath = container.get('namespace.resolver').resolveWithSubpath(config['config.path'], 'lib');
        const webpackConfig = require(webpackConfigPath);

        const compiler = webpack(webpackConfig);

        compiler.run((err, stats) => {

            container.get('logger').debug('finished compiling');

		    cb();

        });

	}
};
