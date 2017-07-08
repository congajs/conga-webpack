/*
 * This file is part of the conga-webpack module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const AssetsPlugin = require('assets-webpack-plugin');

/**
 * The WebpackManager handles adding webpack middleware to express when
 * developmode is enabled
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class WebpackManager {

    /**
     * Register the Webpack express middleware
     *
     * @param  {Container} container
     * @param  {Object}    app
     * @param  {Function}  next
     * @return {void}
     */
    onKernelRegisterMiddleware(container, app, next) {

        this.container = container;

        const config = container.get('config').get('webpack');

        if (config['development']) {

            const webpackConfigs = this.buildWebpackConfigFromConfig(config);

            const compiler = webpack(webpackConfigs);

            const webpackMiddlewareInstance = webpackDevMiddleware(compiler, {
                publicPath: config['public.path'],
                reporter: function(options) {

                }
            });

            webpackMiddlewareInstance.waitUntilValid(() => {
                this.reloadAssets(config);
            });

            app.use(webpackMiddlewareInstance);
            app.use(webpackHotMiddleware(compiler));

            next();

        } else {

            this.reloadAssets(config);
            next();

        }

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

        config['config.paths'].forEach((configPath) => {

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

        const assetsPluginInstance = new AssetsPlugin({
            path: this.setupBuildDirectory(config)
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

    /**
     * [onKernelBuild description]
     *
     * @param  {[type]}   container [description]
     * @param  {Function} next      [description]
     * @return {[type]}             [description]
     */
    onKernelBuild(container, next) {

        this.container = container;

        const config = container.get('config').get('webpack');
        const buildDir = this.setupBuildDirectory(config);
        const webpackConfigs = this.buildWebpackConfigFromConfig(config);

        // fix the output paths and add manifest plugin
        webpackConfigs.forEach((webpackConfig) => {
            webpackConfig.output.path = buildDir;
        });

        webpack(webpackConfigs, (err, stats) => {
            next();
        });

    }

    /**
     * Set up the public build directory and return the absolute path to it
     *
     * @param  {Object} config
     * @return {String}
     */
    setupBuildDirectory(config) {

        const dir = path.join(this.container.getParameter('kernel.app_public_path'), config['public.path']);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        return dir;
    }

    reloadAssets(config) {

        const dir = path.join(this.container.getParameter('kernel.app_public_path'), config['public.path']);
        const data = require(path.join(dir, 'webpack-assets.json'));

        this.container.get('conga.webpack.registry').setup(data, config['public.path']);
    }
}
