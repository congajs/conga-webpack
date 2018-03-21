/*
 * This file is part of the conga-webpack module.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');

/**
 * The WebpackBuilders handles finding all of the webpack configurations
 * and then running webpack to compile the final assets.
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class WebpackBuilder {

    /**
     * @param  {Container} container
     */
    constructor(container) {
        this.container = container;
    }

    /**
     * Build the assets
     *
     * @param  {[type]}   config [description]
     * @param  {Function} next   [description]
     * @return {[type]}          [description]
     */
    build(config, next) {

        this.container.get('logger').info('[conga-webpack] - starting build process');

        const frameworkConfig = this.container.get('config').get('framework');

        const buildDir = this.setupBuildDirectory(config);
        const webpackConfigs = this.buildWebpackConfigFromConfig(config);

        let contentBase = config.contentBase;
        if (!contentBase) {
            contentBase = 'http://' + frameworkConfig.app.host;
            if (frameworkConfig.app.port) {
                contentBase += ':' + frameworkConfig.app.port;
            }
            contentBase += '/';
        }

        // fix the paths
        webpackConfigs.forEach((webpackConfig) => {
            webpackConfig.output.path = buildDir;
            webpackConfig.output.publicPath = contentBase + config['build.public.path'].replace(/^\/+/g, '');
        });

        webpack(webpackConfigs, (err, stats) => {

            this.container.get('logger').info(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true
            }));

            this.container.get('logger').info('[conga-webpack] - finished build');
            next();
        });

    }

    /**
     * Set up the build directory and return the absolute path to it
     *
     * @param  {Object} config
     * @return {String}
     */
    setupBuildDirectory(config) {

        const dir = config['build.dir'];

        if (!fs.existsSync(dir)) {
            fs.ensureDir(dir);
        }

        return dir;
    }

    /**
     * Build an array of webpack config objects to pass to webpack
     * based on the current conga configuration
     *
     * @param  {Object} config      the @conga/framework-webpack config object
     * @return {Array}              array of all config objects from all webpack.* files
     */
    buildWebpackConfigFromConfig(config) {

        const configs = [];

        // combine all config objects
        if ('config.paths' in config && config['config.paths'] !== null) {

            config['config.paths'].forEach((configPath) => {

                this.container.get('logger').info('[conga-webpack] - loading config: ' + configPath);

                const webpackConfigPath = this.container.get('namespace.resolver').resolveWithSubpath(configPath, 'lib');
                const webpackConfig = require(webpackConfigPath);

                if (Array.isArray(webpackConfig)) {

                    webpackConfig.forEach((c) => {
                        configs.push(c);
                    });

                } else {
                    configs.push(webpackConfig);
                }

            });

        }

        // find any tagged webpack factory classes and run them
        const tags = this.container.getTagsByName('webpack.config.factory');

        if (tags) {

            tags.forEach((tag) => {
                const service = this.container.get(tag.getServiceId());

                configs.push(
                    service[tag.getParameter('method')]()
                );
            });
        }

        // run any defined factory services
        if ('factories' in config && config['config.factories'] !== null) {

            config['factories'].forEach((factory) => {

                const service = this.container.get(factory.service);

                configs.push(
                    service[factory.method]()
                );
            });
        }

        // set up the assets plugin
        const assetsPluginInstance = new AssetsPlugin({
            path: config['build.dir'],
            filename: config.development ? 'webpack-assets.dev.json' : 'webpack-assets.json'
        });

        // fix the output paths and add manifest plugin
        configs.forEach((webpackConfig) => {

            if (typeof webpackConfig.plugins === 'undefined') {
                webpackConfig.plugins = [];
            }

            webpackConfig.plugins.push(assetsPluginInstance);

        });

        return configs;
    }
}
