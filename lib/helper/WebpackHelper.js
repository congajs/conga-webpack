/*
 * This file is part of the conga-webpack module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

 /**
  * The WebpackHelper provides methods to retrieve asset urls
  *
  * @author Marc Roulias <marc@lampjunkie.com>
  */
module.exports = class WebpackHelper {

    constructor(registry) {

        this.registry = registry;

        this.methods = {
          'webpack_asset': 'asset'
      };
    }

    /**
     * Get the compiled asset path for an entry name
     *
     * @param  {Request} req  the request object
     * @param  {String}  name the entry name
     * @return {String}
     */
    asset(req, name) {
        return this.registry.get(name);
    }
}
