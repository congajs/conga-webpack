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

const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

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

        let isFirstPass = true;

        this.container = container;

        const frameworkConfig = container.get('config').get('framework');
        const config = container.get('config').get('webpack') || {};

        if (config.development) {

            this.container.get('logger').info('[conga-webpack] - setting up webpack dev compilation');

            const webpackConfigs = this.buildWebpackConfigFromConfig(config);

            if (webpackConfigs.length === 0) {
                next();
                return;
            }

            const compiler = webpack(webpackConfigs);//, () => {
            //     this.container.get('logger').info('[conga-webpack] - finished dev compilation');
            //     this.reloadAssets(config);
            //     next();
            // });

            let contentBase = config.contentBase;
            if (!contentBase) {
                contentBase = 'http://' + frameworkConfig.app.host;
                if (frameworkConfig.app.port) {
                    contentBase += ':' + frameworkConfig.app.port;
                }
                contentBase += '/';
            }

            const webpackMiddlewareInstance = webpackDevMiddleware(compiler, {
                //publicPath: config['public.path'],
                // noInfo: false,
                // quiet: false,
                contentBase: contentBase,
                headers: config.headers,
                proxy: config.proxy,
                inline: config.inline,
                reporter: (options) => {

                    this.container.get('logger').info('[conga-webpack] - finished dev compilation');
                    this.reloadAssets(config);

                    console.log(webpackMiddlewareInstance);


                    if (isFirstPass) {
                        next();
                        isFirstPass = false;
                    }

                }
            });

            // webpackMiddlewareInstance.waitUntilValid(() => {
            //     this.reloadAssets(config);
            // });

            app.use(webpackMiddlewareInstance);
            // app.use(webpackHotMiddleware(compiler, {
            //     //path: '/__what'
            // }));

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

        if (config['config.paths'] === null) {
            return configs;
        }

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
     * Run the production build process
     *
     * @param  {Container} container     the service container
     * @param  {Object}    targetConfig  the config object for the target environment
     * @param  {Function}  next
     * @return {void}
     */
    onKernelBuild(container, targetConfig, next) {

        this.container = container;

        this.container.get('logger').info('[conga-webpack] - starting production build');

        const config = targetConfig.get('webpack');
        const buildDir = this.setupBuildDirectory(config);
        const webpackConfigs = this.buildWebpackConfigFromConfig(config);

        // fix the output paths and add manifest plugin
        webpackConfigs.forEach((webpackConfig) => {
            webpackConfig.output.path = buildDir;
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

    /**
     * Load all of the asset filenames and paths in to the webpack registry
     *
     * @param  {Object} config
     * @return {void}
     */
    reloadAssets(config) {

        const dir = path.join(this.container.getParameter('kernel.app_public_path'), config['public.path']);
        const data = require(path.join(dir, 'webpack-assets.json'));

        this.container.get('conga.webpack.registry').setup(data, '');//config['public.path']);
    }
}
