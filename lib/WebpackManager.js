/*
 * This file is part of the conga-webpack module.
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
 * development mode is enabled or running the webpack build process when it
 * is disabled.
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

        // use webpack-dev-middleware when we are in development mode
        if (config['development']) {

            this.container.get('logger').info('[conga-webpack] - setting up webpack dev compilation');

            const webpackConfigs = this.container.get('conga.webpack.builder').buildWebpackConfigFromConfig(config);

            if (webpackConfigs.length === 0) {
                return next();
            }

            webpackConfigs.forEach((webpackConfig) => {
                webpackConfig.output.publicPath = config['public.dev.path'];
            });

            const compiler = webpack(webpackConfigs, (err, stats) => {

                stats.stats.forEach((stat) => {

                    for (let name in stat.compilation.assets) {
                        this.container.get('logger').info('[conga-webpack] - compiled dev asset: ' + name);
                    }
                });

                this.container.get('logger').info('[conga-webpack] - finished dev compilation');
                this.reloadAssets(config, next);
            });

            const webpackMiddlewareInstance = webpackDevMiddleware(compiler, {
                publicPath: config['public.dev.path'],
                noInfo: true,
                quiet: true,
                // reporter: (options) => {
                //
                //     options.stats.stats.forEach((stat) => {
                //
                //         for (let name in stat.compilation.assets) {
                //             this.container.get('logger').info('[conga-webpack] - compiling dev asset: ' + name);
                //         }
                //     });
                //
                // }
            });

            webpackMiddlewareInstance.waitUntilValid(() => {
                this.container.get('logger').info('[conga-webpack] - dev is valid');
            });

            app.use(webpackMiddlewareInstance);
            // app.use(webpackHotMiddleware(compiler, {
            //     //path: '/__what'
            // }));

        } else {

            if (config['force.build']) {

                this.build(config, () => {
                    this.reloadAssets(config, next);
                });

            } else {

                this.reloadAssets(config, next);

            }
        }
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
        this.build(targetConfig.get('webpack'), next);
    }

    /**
     * Build the asset files
     *
     * @param  {Object}   config
     * @param  {Function} next
     * @return {void}
     */
    build(config, next) {
        this.container.get('conga.webpack.builder').build(config, next);
    }

    /**
     * Load all of the asset filenames and paths in to the webpack registry
     *
     * @param  {Object} config
     * @return {void}
     */
    reloadAssets(config, cb) {

        const dir = path.join(this.container.getParameter('kernel.app_public_path'), config['build.public.path']);
        const source = path.join(dir, config.development ? 'webpack-assets.dev.json' : 'webpack-assets.json');

        this.container.get('conga.webpack.registry').setup(source);

        cb();
    }
}
