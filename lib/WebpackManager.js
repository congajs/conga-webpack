/*
 * This file is part of the conga-webpack module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
const path = require('path');

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

        const config = container.get('config').get('webpack');

        console.log(config);

        if (config['development']) {

            if (!Array.isArray(config['config.paths'])) {
                return next();
            }

            container.get('logger').debug('[conga-webpack] - adding webpack middleware');

            config['config.paths'].forEach((configPath) => {

                const webpackConfigPath = container.get('namespace.resolver').resolveWithSubpath(configPath, 'lib');
                const webpackConfig = require(webpackConfigPath);

                // fix the entry path
                webpackConfig.entry = path.join(path.dirname(webpackConfigPath), webpackConfig.entry);

                console.log(webpackConfig.entry);

                const compiler = webpack(webpackConfig);

                app.use(webpackDevMiddleware(compiler, {
                    publicPath: config['public.path'],
                    reporter: function(options) {
                        console.log(options);
                    }
                }));

                app.use(webpackHotMiddleware(compiler));

            });

        }

        next();
    }

    onKernelBuild(container, next) {





        next();
    }
}
