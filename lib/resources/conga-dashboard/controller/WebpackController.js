const Controller = require('@conga/framework').Controller;

/**
 * @Route("/_conga/webpack")
 */
module.exports = class WebpackController extends Controller {

    /**
     * @Route("/configurations", methods=['GET'])
     */
    configurations(req, res) {

        const config = this.container.get('config').get('webpack');

        const configurations = [];

        config['config.paths'].forEach((configPath) => {

            const webpackConfigPath = this.container.get('namespace.resolver').resolveWithSubpath(configPath, 'lib');

            configurations.push({
                path: webpackConfigPath
            });

        });

        res.return({
            configurations: configurations,
        });
    }

}
