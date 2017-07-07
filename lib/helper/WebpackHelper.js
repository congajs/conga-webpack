/*
 * This file is part of the conga-webpack module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

 /**
  * The UrlHelper provides view helps to deal with routing URLs
  *
  * @author Marc Roulias <marc@lampjunkie.com>
  */
module.exports = class UrlHelper {

    constructor(router) {
        this.router = router;

        this.methods = {
          'webpack_asset': 'asset'
      };
    }

    /**
     * Build a full URL for a route name and parameters
     *
     * @param  {Request} req        the request object
     * @param  {String}  asset      the asset name
     * @return {String}
     */
    asset(req, asset) {
        //return this.router.generateUrl(req, route, params, isAbsolute);
    }
}
