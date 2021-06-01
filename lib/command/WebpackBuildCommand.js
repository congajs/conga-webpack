/*
 * This file is part of the conga-webpack module.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// framework libs
const { AbstractCommand } = require('@conga/framework').command;

/**
 * The webpack build command helps run the webpack build process standalone
 */
class WebpackBuildCommand extends AbstractCommand {

    /**
     * {@inheritDoc}
     * @see AbstractCommand.command
     */
    static get command() {
        return 'webpack:build';
    }

    /**
     * {@inheritDoc}
     * @see AbstractCommand.description
     */
    static get description() {
        return 'Run the webpack build process';
    }

    /**
     * {@inheritDoc}
     * @see AbstractCommand.options
     */
    static get options() {
        return {
            // 'value' : ['-v, --value [value]', 'Provide a value'],
        };
    }

    /**
     * {@inheritDoc}
     * @see AbstractCommand.execute
     */
    execute(input, output, next) {
        this.container.get('conga.webpack.manager')
            .onKernelBuild(this.container, this.container.get('config'), next);
    }
}

module.exports = WebpackBuildCommand;