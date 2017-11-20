/*
 * This file is part of the conga-webpack module.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The WebpackRegistry holds the data from the current webpack-assets.json file
 * and provides methods to retrieve the file path to a specific asset
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class WebpackRegistry {

    /**
     * @constructor
     */
    constructor() {
        this.assets = null;
    }

    /**
     * Set the path to the webpack-assets.json source and load it
     *
     * @param  {String} source
     * @return {void}
     */
    setup(source) {
        this.source = source;
        this.loadAssets();
    }

    /**
     * Get the path to an asset by name and type
     *
     * @param  {String} name  the asset bundle name
     * @param  {String} type  the asset type (js,css)
     * @return {String}
     */
    get(name, type = 'js') {

        if (this.assets === null) {
            this.loadAssets();
        }

        if (typeof this.assets[name] === 'undefined' || typeof this.assets[name][type] === 'undefined') {
            return name + '-' + type + '-not.found';
        }

        return this.assets[name][type];
    }

    /**
     * Load the asset entries from the current webpack-assets.json file
     *
     * @return {String}
     */
    loadAssets() {
        this.assets = require(this.source);
    }
}
