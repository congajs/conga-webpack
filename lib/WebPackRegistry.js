/*
 * This file is part of the conga-webpack module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The WebpackRegistry holds the data from the current webpack-assets.json file
 * and provides methods to retrieve the file path to a specific asset
 */
module.exports = class WebpackRegistry {

    setup(assets, base) {
        this.assets = assets;
        this.base = base;
    }

    get(name, type = 'js') {

        if (typeof this.assets[name] === 'undefined' || typeof this.assets[name][type] === 'undefined') {
            return name + '|' + type + '|not.found';
        }

        return this.assets[name][type];
    }
}
